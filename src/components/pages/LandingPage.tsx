import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingDown, Truck, Target, BarChart3, Map, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import heroImage from 'figma:asset/5d8786fdacf2d140f0e9c0520f8257c68ee2c4f7.png';
import bracellLogo from 'figma:asset/1afbf363332f423994c4f77f53ad3bb93a7d9d7e.png';
import mapRoutes from 'figma:asset/4a48ea17f85662eec81f973298147e0aa2ffa953.png';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const benefits = [
    { 
      icon: Target, 
      title: 'Atende 100% da Demanda', 
      description: 'Otimização inteligente garante cumprimento das metas diárias da fábrica',
      metric: '100%',
      metricLabel: 'Taxa de atendimento'
    },
    { 
      icon: TrendingDown, 
      title: 'Reduz Trocas de Módulo', 
      description: 'Minimiza mudanças desnecessárias de módulos de colheita, aumentando produtividade',
      metric: '-40%',
      metricLabel: 'Redução de trocas'
    },
    { 
      icon: Truck, 
      title: 'Maximiza Uso da Frota', 
      description: 'Aproveitamento otimizado de veículos e motoristas com rotas eficientes',
      metric: '+25%',
      metricLabel: 'Eficiência da frota'
    },
    { 
      icon: BarChart3, 
      title: 'Pesquisa Operacional', 
      description: 'Algoritmos avançados de otimização para decisões baseadas em dados',
      metric: '< 2min',
      metricLabel: 'Tempo de otimização'
    },
  ];

  const features = [
    'Planejamento diário com simulação de cenários',
    'Visualização de rotas e status em tempo real',
    'Priorização por produtividade das fazendas',
    'Monitoramento de KPIs e alertas automáticos',
    'Otimização de distância, tempo e custo',
    'Gestão completa de frota e motoristas',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <img src={bracellLogo} alt="Bracell" className="h-16 mx-auto mb-8" />
          <h1 className="text-5xl lg:text-7xl text-white mb-6">
            Sistema de Roteirização de Transporte de Madeira
          </h1>
          <p className="text-xl lg:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
            Planeje, simule e execute a programação diária de transporte com máxima produtividade, atendendo 100% da demanda e minimizando trocas de módulos.
          </p>
          <Button size="lg" onClick={onEnter} className="text-lg px-8 py-6">
            Acessar Sistema
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl text-center mb-4">Benefícios da Otimização</h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Transforme sua operação logística com decisões baseadas em Pesquisa Operacional
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="h-full"
                  >
                    <div className="h-full bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative p-6">
                        {/* Icon with animation */}
                        <motion.div 
                          className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300"
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="size-7 text-white" />
                        </motion.div>
                        
                        <h3 className="text-lg mb-3">{benefit.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{benefit.description}</p>
                        
                        {/* Metric Badge */}
                        <div className="pt-4 border-t border-gray-100">
                          <div className="inline-flex items-baseline gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                            <span className="text-2xl text-blue-600">{benefit.metric}</span>
                            <span className="text-xs text-gray-600">{benefit.metricLabel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features with Map */}
      <div className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl mb-6">Recursos Principais</h2>
              <p className="text-xl text-gray-600 mb-8">
                Gestão completa do ciclo de transporte, desde o planejamento até a execução
              </p>
              
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <CheckCircle className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img src={mapRoutes} alt="Mapa com rotas interligadas" className="w-full" />
              </div>
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Map className="size-8 mb-2" />
                <p className="text-sm">Visualização de rotas em tempo real</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl mb-6 text-white">Pronto para otimizar sua operação?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Comece a planejar rotas mais eficientes e produtivas hoje mesmo
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              onClick={onEnter} 
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Acessar Sistema
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}