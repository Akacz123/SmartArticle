import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api';

function IntelligenceView({ userId, onReadArticle }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [userId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/intelligence/analytics/${userId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Sztuczna Inteligencja': return '#4338ca';
      case 'Cyberbezpieczeństwo': return '#be123c';
      case 'Chmura i DevOps': return '#0369a1';
      case 'Programowanie': return '#047857';
      case 'Nauka': return '#6d28d9';
      case 'Zdrowie': return '#b45309';
      case 'Biznes': return '#334155';
      default: return '#0f172a';
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <span>Generowanie predykcji i mapy przestrzeni cech PCA...</span>
      </div>
    );
  }

  if (!data || !data.userPersona) {
    return (
      <div className="empty-state">
        Brak wystarczających danych do wyznaczenia modelu predykcyjnego. Przeczytaj kilka artykułów z bazy.
      </div>
    );
  }

  const { userPersona, predictedNextCategory, categoryProbabilities, optimalReadingTimeMinutes, predictedEngagementScore, pcaProjection, modelMetrics } = data;

  const svgWidth = 720;
  const svgHeight = 420;
  const padding = 50;

  const points = pcaProjection?.articlePoints || [];
  const userPt = pcaProjection?.userPoint || { x: 0, y: 0 };

  const allX = [...points.map(p => p.x), userPt.x];
  const allY = [...points.map(p => p.y), userPt.y];

  const minX = Math.min(...allX, -0.6);
  const maxX = Math.max(...allX, 0.6);
  const minY = Math.min(...allY, -0.6);
  const maxY = Math.max(...allY, 0.6);

  const scaleX = (val) => {
    return padding + ((val - minX) / (maxX - minX || 1)) * (svgWidth - 2 * padding);
  };

  const scaleY = (val) => {
    return svgHeight - padding - ((val - minY) / (maxY - minY || 1)) * (svgHeight - 2 * padding);
  };

  return (
    <div className="intelligence-container">
      <div className="section-intro">
        <h1 className="page-heading">Predykcje i Analityka Inteligentna</h1>
        <p className="page-subheading">
          Moduł uczenia maszynowego (przedmiot: Informatyka i Systemy Inteligentne) wykorzystujący faktoryzację macierzy SVD, algorytmy KNN, redukcję wymiarowości PCA oraz analizę prawdopodobieństw przejść.
        </p>
      </div>

      <div className="intel-grid-top">
        <div className="intel-card persona-card">
          <div className="intel-badge">Segmentacja behawioralna</div>
          <h2 className="persona-title">{userPersona.name}</h2>
          <p className="persona-desc">{userPersona.description}</p>
          <div className="meter-wrapper">
            <div className="meter-label">
              <span>Pewność klasyfikacji profilu:</span>
              <strong>{Math.round((userPersona.confidence || 0.75) * 100)}%</strong>
            </div>
            <div className="meter-bar">
              <div
                className="meter-fill"
                style={{ width: `${Math.round((userPersona.confidence || 0.75) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="intel-card next-topic-card">
          <div className="intel-badge">Predykcja kolejnego wyboru</div>
          <h3 className="card-sub-title">Przewidywana następna tematyka</h3>
          <div className="next-cat-highlight">
            <span className="next-cat-name">{predictedNextCategory?.category || 'Sztuczna Inteligencja'}</span>
            <span className="next-cat-prob">
              {Math.round((predictedNextCategory?.probability || 0.4) * 100)}% szans
            </span>
          </div>

          <div className="probs-list">
            {(categoryProbabilities || []).slice(0, 4).map((item) => (
              <div key={item.category} className="prob-item">
                <span className="prob-cat">{item.category}</span>
                <div className="prob-bar-wrap">
                  <div
                    className="prob-bar-fill"
                    style={{
                      width: `${Math.round(item.probability * 100)}%`,
                      backgroundColor: getCategoryColor(item.category)
                    }}
                  ></div>
                </div>
                <span className="prob-num">{Math.round(item.probability * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="intel-card metrics-card">
          <div className="intel-badge">Predykcja zaangażowania</div>
          <div className="stat-unit">
            <span className="unit-label">Optymalny czas lektury</span>
            <span className="unit-val">{optimalReadingTimeMinutes} min</span>
            <span className="unit-sub">wyznaczony z profilu czytelnika</span>
          </div>

          <div className="stat-unit">
            <span className="unit-label">Wskaźnik zaangażowania</span>
            <span className="unit-val">{predictedEngagementScore} / 100</span>
            <span className="unit-sub">estymacja retencji uwagi</span>
          </div>
        </div>
      </div>

      <div className="intel-card pca-card">
        <div className="pca-header">
          <div>
            <div className="intel-badge">Redukcja wymiarowości PCA (2D)</div>
            <h3 className="section-title">Wektorowa przestrzeń podobieństwa artykułów i profilu</h3>
            <p className="section-desc">
              Rzutowanie wielowymiarowej macierzy cech tekstowych (TF-IDF) na 2 główne składowe PCA. Najedź na punkt, aby zobaczyć predykcję oceny.
            </p>
          </div>

          {hoveredPoint && (
            <div className="pca-tooltip">
              <strong>{hoveredPoint.title}</strong>
              <div className="tooltip-meta">
                <span>{hoveredPoint.category}</span>
                <span>Szacowana ocena: <strong>{hoveredPoint.predictedRating} / 5.0</strong></span>
                <span>Dopasowanie: <strong>{hoveredPoint.affinityPercent}%</strong></span>
              </div>
              <button
                className="btn btn-primary btn-sm tooltip-btn"
                onClick={() => onReadArticle(hoveredPoint.id, false)}
              >
                Otwórz artykuł
              </button>
            </div>
          )}
        </div>

        <div className="svg-wrapper">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="pca-svg"
          >
            <line
              x1={padding}
              y1={svgHeight / 2}
              x2={svgWidth - padding}
              y2={svgHeight / 2}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />
            <line
              x1={svgWidth / 2}
              y1={padding}
              x2={svgWidth / 2}
              y2={svgHeight - padding}
              stroke="#e2e8f0"
              strokeDasharray="4 4"
            />

            <text x={svgWidth - padding - 80} y={svgHeight / 2 - 8} fill="#94a3b8" fontSize="11">
              Składowa PCA 1 →
            </text>
            <text x={svgWidth / 2 + 10} y={padding + 16} fill="#94a3b8" fontSize="11">
              ↑ Składowa PCA 2
            </text>

            {points.map((pt) => {
              const cx = scaleX(pt.x);
              const cy = scaleY(pt.y);
              const isSelected = hoveredPoint?.id === pt.id;

              return (
                <circle
                  key={pt.id}
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 9 : pt.isRead ? 6 : 5}
                  fill={getCategoryColor(pt.category)}
                  opacity={isSelected ? 1 : pt.isRead ? 0.95 : 0.6}
                  stroke={pt.isRead ? '#0f172a' : '#ffffff'}
                  strokeWidth={pt.isRead ? 2 : 1}
                  className="pca-point"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onClick={() => onReadArticle(pt.id, false)}
                />
              );
            })}

            <g transform={`translate(${scaleX(userPt.x)}, ${scaleY(userPt.y)})`}>
              <circle r="14" fill="#2563eb" opacity="0.25" className="user-pulse" />
              <circle r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              <text x="12" y="4" fill="#0f172a" fontSize="12" fontWeight="700">
                Twój profil
              </text>
            </g>
          </svg>
        </div>

        <div className="pca-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#2563eb' }}></span>
            <span>Profil użytkownika (wektor zainteresowań)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#4338ca' }}></span>
            <span>AI & Data</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#be123c' }}></span>
            <span>Cyberbezpieczeństwo</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#0369a1' }}></span>
            <span>Chmura & DevOps</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#047857' }}></span>
            <span>Programowanie</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ border: '2px solid #0f172a', backgroundColor: '#94a3b8' }}></span>
            <span>Artykuł przeczytany</span>
          </div>
        </div>
      </div>

      <div className="intel-card algorithm-details">
        <h3 className="section-title">Architektura Modelu Inteligencji Obliczeniowej</h3>
        <div className="algo-grid">
          <div className="algo-item">
            <span className="algo-label">Zastosowane algorytmy</span>
            <span className="algo-val">{modelMetrics?.algorithm}</span>
          </div>
          <div className="algo-item">
            <span className="algo-label">Wyjaśniona wariancja składowych</span>
            <span className="algo-val">{Math.round((modelMetrics?.explainedVarianceRatio || 0.78) * 100)}% całkowitej informacji</span>
          </div>
          <div className="algo-item">
            <span className="algo-label">Przebadana przestrzeń artykułów</span>
            <span className="algo-val">{modelMetrics?.totalAnalyzedArticles || 0} wektorów dokumentów</span>
          </div>
          <div className="algo-item">
            <span className="algo-label">Aktywne interakcje uczące</span>
            <span className="algo-val">{modelMetrics?.totalInteractions || 0} zarejestrowanych zachowań</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntelligenceView;
