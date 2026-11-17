import React, { useState, useEffect } from "react";
import { Character, DriveFileItem, GameBackupData, UserProfile } from "../types";
import { sound } from "../utils/audio";
import {
  signInWithGoogleDrive,
  disconnectGoogleDrive,
  listDriveBackups,
  uploadGameBackupToDrive,
  downloadGameBackupFromDrive,
  deleteDriveFile,
  exportTrophyCertificateToDrive,
  getAccessToken,
} from "../lib/googleDrive";
import {
  ArrowLeft,
  Cloud,
  CloudUpload,
  CloudDownload,
  Trash2,
  ExternalLink,
  RefreshCw,
  Award,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Calendar,
  HardDrive,
  ShieldCheck,
  Trophy,
} from "lucide-react";

// Official Google Sign-in SVG
export const GoogleLogoSvg = () => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="w-5 h-5 block"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

interface DriveModalProps {
  currentUser: UserProfile | null;
  highScore: number;
  character: Character;
  onRestoreBackup: (backup: GameBackupData) => void;
  onProfileUpdated: (user: UserProfile | null) => void;
  onBack: () => void;
}

export const DriveModal: React.FC<DriveModalProps> = ({
  currentUser,
  highScore,
  character,
  onRestoreBackup,
  onProfileUpdated,
  onBack,
}) => {
  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Confirmation dialog state for destructive action (Mandatory requirement)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);

  // Check initial token
  useEffect(() => {
    getAccessToken().then((token) => {
      if (token) {
        setHasToken(true);
        loadFiles();
      }
    });
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const items = await listDriveBackups();
      setFiles(items);
    } catch (err: any) {
      console.warn("Error fetching files from Google Drive:", err);
      if (err.message?.includes("expirou") || err.message?.includes("Faça login")) {
        setHasToken(false);
      }
      setErrorMessage(err.message || "Erro ao listar backups do Google Drive.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    sound.playClick();
    setActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await signInWithGoogleDrive();
      if (res) {
        setHasToken(true);
        onProfileUpdated(res.profile);
        sound.playHighScore();
        setSuccessMessage(`Conectado com sucesso ao Google Drive! Olá, ${res.profile.displayName}!`);
        await loadFiles();
      }
    } catch (err: any) {
      console.error("Google Drive connection error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setErrorMessage("A janela de login do Google foi fechada antes de concluir.");
      } else {
        setErrorMessage(err.message || "Falha ao conectar com o Google Drive.");
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    sound.playClick();
    await disconnectGoogleDrive();
    setHasToken(false);
    setFiles([]);
    setSuccessMessage("Google Drive desconectado com sucesso.");
  };

  const handleCreateBackup = async () => {
    sound.playClick();
    setActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const backupData: GameBackupData = {
        appName: "Céu é o Limite",
        version: "2.5.0",
        backupDate: new Date().toISOString(),
        timestamp: Date.now(),
        player: {
          displayName: currentUser?.displayName || "Aventureiro",
          email: currentUser?.email || undefined,
          highScore,
          maxHeight: currentUser?.maxHeight || 0,
          totalGames: currentUser?.totalGames || 0,
          selectedCharacterId: character.id,
        },
      };

      const created = await uploadGameBackupToDrive(backupData);
      sound.playHighScore();
      setSuccessMessage(`Backup salvo com sucesso no Google Drive: ${created.name}`);
      await loadFiles();
    } catch (err: any) {
      console.error("Error creating backup in Google Drive:", err);
      setErrorMessage(err.message || "Erro ao salvar backup no Google Drive.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCertificate = async () => {
    sound.playClick();
    setActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const created = await exportTrophyCertificateToDrive({
        playerName: currentUser?.displayName || "Aventureiro Destemido",
        highScore,
        maxHeight: currentUser?.maxHeight || Math.floor(highScore / 1.5),
        characterName: character.name,
      });
      sound.playHighScore();
      setSuccessMessage(`🏆 Certificado salvo no seu Google Drive! Arquivo: ${created.name}`);
      await loadFiles();
    } catch (err: any) {
      console.error("Error exporting certificate:", err);
      setErrorMessage(err.message || "Erro ao exportar certificado.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async (file: DriveFileItem) => {
    sound.playClick();
    if (!window.confirm(`Deseja restaurar o backup "${file.name}" para o seu jogo atual?`)) {
      return;
    }

    setActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const backup = await downloadGameBackupFromDrive(file.id);
      onRestoreBackup(backup);
      sound.playHighScore();
      setSuccessMessage(
        `Progresso restaurado com sucesso! Recorde carregado: ${backup.player.highScore.toLocaleString()} pts`
      );
    } catch (err: any) {
      console.error("Error restoring backup:", err);
      setErrorMessage(err.message || "Erro ao carregar dados do backup.");
    } finally {
      setActionLoading(false);
    }
  };

  // Mandatory confirmation dialog handling for destructive file deletion
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    sound.playClick();
    const targetFile = fileToDelete;
    setFileToDelete(null);

    setActionLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await deleteDriveFile(targetFile.id);
      setSuccessMessage(`Arquivo "${targetFile.name}" excluído do Google Drive.`);
      await loadFiles();
    } catch (err: any) {
      console.error("Error deleting file:", err);
      setErrorMessage(err.message || "Erro ao excluir arquivo do Google Drive.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div
      id="drive-modal-screen"
      className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-6 text-white z-40 select-none overflow-y-auto"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full pb-4 border-b border-white/10">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-sm font-bold"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-1">
            <HardDrive size={12} />
            <span>Nuvem Google Workspace</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-wide uppercase bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Cloud className="text-sky-400" size={24} />
            Google Drive Cloud Save
          </h2>
        </div>

        <div className="w-16" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto w-full my-auto py-4 space-y-4">
        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-red-200 animate-in fade-in">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <p className="flex-1">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-emerald-200 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <p className="flex-1">{successMessage}</p>
          </div>
        )}

        {/* Not Connected State */}
        {!hasToken ? (
          <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 md:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Cloud size={32} className="text-white" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-black">
                Sincronize seus Recordes no Google Drive
              </h3>
              <p className="text-xs md:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Conecte sua Conta Google para salvar backups automáticos das suas melhores pontuações,
                gerar certificados oficiais e restaurar seu progresso em qualquer dispositivo.
              </p>
            </div>

            {/* Official Sign in with Google Button (as required by Workspace Skill) */}
            <div className="flex flex-col items-center justify-center pt-2 gap-3">
              <button
                onClick={handleSignIn}
                disabled={actionLoading}
                className="gsi-material-button relative inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-white text-slate-800 hover:bg-slate-100 active:scale-95 transition-all shadow-xl font-bold text-sm border border-slate-200 disabled:opacity-50"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper flex items-center gap-3">
                  <div className="gsi-material-button-icon">
                    <GoogleLogoSvg />
                  </div>
                  <span className="gsi-material-button-contents font-medium tracking-wide">
                    {actionLoading ? "Conectando ao Google..." : "Sign in with Google"}
                  </span>
                </div>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Permissão segura solicitada diretamente pela sua Conta Google</span>
              </div>
            </div>
          </div>
        ) : (
          /* Connected State */
          <div className="space-y-4">
            {/* Account Status Pill & Action Buttons */}
            <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow">
                  <GoogleLogoSvg />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white">
                      {currentUser?.displayName || "Conta Google Conectada"}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                      Conectado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                    {currentUser?.email || "Google Drive Ativo"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={loadFiles}
                  disabled={loading || actionLoading}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300"
                  title="Atualizar lista de arquivos"
                >
                  <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 text-xs font-bold transition-all active:scale-95"
                >
                  Desconectar
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleCreateBackup}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:brightness-110 active:scale-98 transition-all font-black text-xs text-white shadow-lg shadow-sky-500/20 disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CloudUpload size={16} />
                )}
                <span>Salvar Progresso Atual no Drive</span>
              </button>

              <button
                onClick={handleExportCertificate}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 active:scale-98 transition-all font-black text-xs text-slate-950 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                <Award size={16} />
                <span>Exportar Certificado de Recorde (TXT)</span>
              </button>
            </div>

            {/* Files List on Google Drive */}
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText size={14} className="text-sky-400" />
                  Arquivos do Jogo no Google Drive ({files.length})
                </span>
                <span className="text-[10px] text-slate-400">
                  Recorde Local: {highScore.toLocaleString()} pts
                </span>
              </div>

              {loading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                  <Loader2 size={24} className="animate-spin text-sky-400" />
                  <span>Carregando arquivos do Google Drive...</span>
                </div>
              ) : files.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs space-y-1">
                  <Cloud className="mx-auto text-slate-600" size={32} />
                  <p className="font-bold text-slate-300">Nenhum backup encontrado no seu Drive</p>
                  <p className="text-[11px] text-slate-500">
                    Clique em "Salvar Progresso Atual no Drive" para criar seu primeiro ponto de restauração.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-slate-950/60 border border-white/5 hover:border-white/15 rounded-xl p-3 flex items-center justify-between gap-3 text-xs transition-colors"
                    >
                      <div className="flex items-start gap-2.5 overflow-hidden">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0 mt-0.5">
                          {file.mimeType.includes("json") ? (
                            <HardDrive size={14} />
                          ) : (
                            <Award size={14} className="text-amber-400" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-white truncate max-w-[200px] sm:max-w-xs" title={file.name}>
                            {file.name}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />
                              {file.modifiedTime
                                ? new Date(file.modifiedTime).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Data desconhecida"}
                            </span>
                            {file.size && (
                              <span>• {(parseInt(file.size, 10) / 1024).toFixed(1)} KB</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {file.mimeType.includes("json") && (
                          <button
                            onClick={() => handleRestore(file)}
                            disabled={actionLoading}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] flex items-center gap-1 active:scale-95 transition-all"
                            title="Restaurar este backup"
                          >
                            <CloudDownload size={12} />
                            <span className="hidden sm:inline">Restaurar</span>
                          </button>
                        )}

                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition-colors"
                            title="Visualizar no Google Drive"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}

                        <button
                          onClick={() => setFileToDelete(file)}
                          disabled={actionLoading}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors"
                          title="Excluir arquivo do Google Drive"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Explicit User Confirmation Dialog for Destructive File Deletion */}
      {fileToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <Trash2 size={24} />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-black text-base text-white">Confirmar Exclusão</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tem certeza que deseja excluir o arquivo permanentemente do seu Google Drive?
              </p>
              <p className="text-xs font-mono font-bold text-amber-300 bg-slate-950/60 p-2 rounded-xl break-all">
                {fileToDelete.name}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setFileToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteFile}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-black text-white transition-all shadow-lg shadow-red-600/30"
              >
                Excluir do Drive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="text-center text-[11px] text-slate-500 max-w-lg mx-auto w-full pt-2">
        <span>Seus dados são salvos com segurança na sua própria conta do Google Drive com as permissões concedidas.</span>
      </div>
    </div>
  );
};
