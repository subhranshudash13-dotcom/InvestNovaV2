'use client';
import { motion } from 'framer-motion';
import { Recommendation } from '@/lib/types';
import { TrendingUp, ShieldAlert, Zap, Box } from 'lucide-react';
import { toast } from 'sonner';

export const RecommendationCard = ({ data }: { data: Recommendation }) => {
  const handleTrade = async () => {
    try {
      const response = await fetch('/api/trades/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: data.symbol,
          price: data.current_price,
          type: 'buy', // Default to buy for recommendation execution
        }),
      });

      if (response.ok) {
        toast.success(`Trade executed for ${data.symbol}`);
      } else {
        toast.error('Failed to execute trade');
      }
    } catch (error) {
      toast.error('Error executing trade');
    }
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }} // Floating animation
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.02, rotateY: 5, perspective: 1000 }}
      className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden group"
    >
      {/* Glow Effect */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all" />
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{data.symbol}</h3>
          <p className="text-sm text-gray-400">{data.company_name}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${data.projected_return > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
          {data.projected_return > 0 ? '+' : ''}{data.projected_return}% Est.
        </div>
      </div>

      {/* Consensus Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] uppercase text-gray-500 mb-1">AI Confidence</p>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-lg font-mono text-white">{(data.confidence_score * 100).toFixed(0)}%</span>
          </div>
        </div>
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] uppercase text-gray-500 mb-1">Match Score</p>
          <div className="flex items-center gap-2">
            <Box size={14} className="text-blue-400" />
            <span className="text-lg font-mono text-white">{data.match_score}/100</span>
          </div>
        </div>
      </div>

      {/* Trade Blueprint */}
      <div className="space-y-3 border-t border-white/10 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Entry Price</span>
          <span className="text-white font-mono">${data.entry_price}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Target Price</span>
          <span className="text-emerald-400 font-mono">${data.target_price}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Stop Loss</span>
          <span className="text-red-400 font-mono">${data.stop_loss}</span>
        </div>
      </div>

      <button 
        onClick={handleTrade}
        className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-600/20"
      >
        Execute Trade
      </button>
    </motion.div>
  );
};

