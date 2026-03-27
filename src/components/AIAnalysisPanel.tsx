/**
 * /src/components/AIAnalysisPanel.tsx
 *
 * Painel de análise de senhas com IA (Groq).
 * Exibe: nível de força (com cor), explicação, sugestão e geração de senha.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RefreshCw, ShieldCheck, BarChart3, Loader2 } from 'lucide-react';
import {
  chamarAnaliseSenha,
  chamarGerarSenha,
  type AnaliseSegurancaSenha,
  type SenhaGerada,
} from '@/services/aiClient';
import { toast } from 'sonner';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AIAnalysisPanelProps {
  /** Senha atual do campo (será mascarada antes de qualquer envio) */
  password: string;
  /** Callback para preencher o campo de senha com a senha gerada */
  onPasswordGenerated: (novaSenha: string) => void;
  /** Fechar o painel */
  onClose: () => void;
}

// ─── Mapeamento de nível → cores e ícone ─────────────────────────────────────

const nivelConfig = {
  fraca: {
    color: 'text-red-500',
    bg: 'bg-red-500/10 border-red-500/20',
    badge: 'bg-red-500',
    label: '🔴 Fraca',
  },
  média: {
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    badge: 'bg-yellow-500',
    label: '🟡 Média',
  },
  forte: {
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    badge: 'bg-emerald-500',
    label: '🟢 Forte',
  },
} as const;

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AIAnalysisPanel({ password, onPasswordGenerated, onClose }: AIAnalysisPanelProps) {
  const [analise, setAnalise] = useState<AnaliseSegurancaSenha | null>(null);
  const [senhaGerada, setSenhaGerada] = useState<SenhaGerada | null>(null);
  const [loadingAnalise, setLoadingAnalise] = useState(false);
  const [loadingGerar, setLoadingGerar] = useState(false);

  // ── Analisar senha atual ──────────────────────────────────────────────────
  const handleAnalisar = async () => {
    if (!password) {
      toast.error('Digite uma senha para analisar.');
      return;
    }
    setLoadingAnalise(true);
    setAnalise(null);
    try {
      const resultado = await chamarAnaliseSenha(password);
      setAnalise(resultado);
    } catch (err: unknown) {
      toast.error('Erro ao analisar senha: ' + (err instanceof Error ? err.message : 'Tente novamente.'));
    } finally {
      setLoadingAnalise(false);
    }
  };

  // ── Gerar nova senha forte ────────────────────────────────────────────────
  const handleGerar = async () => {
    setLoadingGerar(true);
    setSenhaGerada(null);
    try {
      const resultado = await chamarGerarSenha();
      setSenhaGerada(resultado);
      onPasswordGenerated(resultado.senha);
      toast.success('✨ Senha forte gerada e aplicada!');
    } catch (err: unknown) {
      toast.error('Erro ao gerar senha: ' + (err instanceof Error ? err.message : 'Tente novamente.'));
    } finally {
      setLoadingGerar(false);
    }
  };

  const config = analise ? nivelConfig[analise.nivel] ?? nivelConfig['média'] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/50 backdrop-blur-sm sm:items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl bg-card p-6 shadow-elevated sm:rounded-3xl"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Sparkles size={15} className="text-primary-foreground" />
            </div>
            <h2 className="font-display text-base font-bold text-card-foreground">
              Análise com IA
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary"
          >
            <X size={18} />
          </button>
        </div>

        {/* Senha mascarada exibida para contexto visual */}
        {password && (
          <div className="mb-4 rounded-xl bg-secondary px-4 py-2.5">
            <p className="text-xs text-muted-foreground mb-0.5">Senha (mascarada)</p>
            <p className="font-mono text-sm text-foreground tracking-widest">
              {password.slice(0, 2)}{'*'.repeat(Math.max(0, password.length - 2))}
            </p>
          </div>
        )}

        {/* Botões de ação */}
        <div className="mb-4 flex flex-col gap-2">
          <button
            onClick={handleAnalisar}
            disabled={loadingAnalise || !password}
            className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loadingAnalise ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Analisando…
              </>
            ) : (
              <>
                <ShieldCheck size={15} />
                Analisar Senha Atual
              </>
            )}
          </button>

          <button
            onClick={handleGerar}
            disabled={loadingGerar}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            {loadingGerar ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Gerando…
              </>
            ) : (
              <>
                <RefreshCw size={15} />
                Gerar Senha Forte com IA
              </>
            )}
          </button>
        </div>

        {/* Resultado da análise */}
        <AnimatePresence>
          {analise && config && (
            <motion.div
              key="analise"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`rounded-2xl border p-4 space-y-3 ${config.bg}`}
            >
              {/* Badge nível */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold text-white ${config.badge}`}>
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {analise.senhaMascarada}
                </span>
              </div>

              {/* Explicação */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Análise
                </p>
                <p className="text-sm text-card-foreground leading-relaxed">
                  {analise.explicacao}
                </p>
              </div>

              {/* Sugestão */}
              <div className="border-t border-border/50 pt-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  💡 Sugestão
                </p>
                <p className="text-sm text-card-foreground leading-relaxed">
                  {analise.sugestao}
                </p>
              </div>
            </motion.div>
          )}

          {/* Resultado da senha gerada */}
          {senhaGerada && (
            <motion.div
              key="gerada"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 space-y-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 size={14} className="text-emerald-500" />
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-wide">
                  Senha Gerada
                </span>
              </div>
              <p className="font-mono text-sm text-card-foreground break-all">
                {senhaGerada.senha}
              </p>
              <p className="text-xs text-muted-foreground">{senhaGerada.descricao}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nota de privacidade */}
        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          🔒 A senha real nunca é enviada à IA — apenas características estatísticas.
        </p>
      </motion.div>
    </motion.div>
  );
}
