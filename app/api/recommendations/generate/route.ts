import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { FinnhubClient } from '@/lib/finnhub/client';
import connectDB from '@/lib/mongodb/connection';
import { Stock } from '@/lib/mongodb/models';
import { Recommendation, Profile } from '@/lib/types';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch User Profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      // Create a default profile if not exists for the purpose of this demo/implementation
      // Or return error. Let's assume it should exist.
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const userProfile = profile as Profile;

    // 3. Data Aggregation & Technical Indicators
    await connectDB();
    const symbols = await FinnhubClient.getTrendingStocks();
    const recommendations: Recommendation[] = [];

    for (const symbol of symbols.slice(0, 15)) { // Limit to 15 for performance in this route
      try {
        // Check MongoDB Cache
        let stockData = await Stock.findOne({ symbol });
        
        if (!stockData) {
          const quote = await FinnhubClient.getQuote(symbol);
          const profileData = await FinnhubClient.getStockProfile(symbol);
          const technicals = await FinnhubClient.getTechnicalIndicators(symbol);
          
          if (!quote || !technicals) continue;

          stockData = await Stock.create({
            symbol,
            name: profileData?.name || symbol,
            price: quote.c,
            volume: quote.v || 0,
            change24h: quote.dp || 0,
            technicals: {
              rsi: technicals.rsi,
              volatility: technicals.volatility,
              beta: technicals.beta,
            },
            sentiment: 0.5, // Mock sentiment
          });
        }

        // 4. ML Inference (Mock)
        const mlPrediction = {
          consensus_prediction: stockData.price * (1 + (Math.random() * 0.1 - 0.05)),
          confidence_score: Math.random() * 0.4 + 0.6,
        };

        // 5. Scoring Logic
        let match_score = 70 + (Math.random() * 30); // Base score
        
        // Penalty for high volatility if user risk is low
        if (userProfile.risk_tolerance === 'low' && stockData.technicals.volatility > 20) {
          match_score -= 20;
        } else if (userProfile.risk_tolerance === 'high' && stockData.technicals.volatility > 30) {
          match_score += 10;
        }

        const projected_return = ((mlPrediction.consensus_prediction - stockData.price) / stockData.price) * 100;

        recommendations.push({
          user_id: user.id,
          symbol: stockData.symbol,
          company_name: stockData.name,
          current_price: stockData.price,
          match_score: Math.round(Math.min(match_score, 100)),
          entry_price: stockData.price,
          target_price: Number((stockData.price * 1.1).toFixed(2)),
          stop_loss: Number((stockData.price * 0.9).toFixed(2)),
          reasoning: `Strong ${stockData.symbol} performance with ${mlPrediction.confidence_score.toFixed(2)} confidence.`,
          confidence_score: mlPrediction.confidence_score,
          projected_return: Number(projected_return.toFixed(2)),
        });
      } catch (err) {
        console.error(`Error processing ${symbol}:`, err);
      }
    }

    // Sort and take top 10
    const topRecommendations = recommendations
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 10);

    // 6. Persistence to Supabase
    if (topRecommendations.length > 0) {
      const { error: insertError } = await supabase
        .from('recommendations')
        .insert(topRecommendations);

      if (insertError) {
        console.error('Error inserting recommendations:', insertError);
      }
    }

    return NextResponse.json(topRecommendations);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
