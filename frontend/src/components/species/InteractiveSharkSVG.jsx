import React from 'react';

export function InteractiveSharkSVG({ activeLayerIdx, activeHotspotId, onHover, onClick }) {
  // Hàm tạo thuộc tính CSS + Event cho từng bộ phận
  const getProps = (id, layerIdx, colorTheme) => {
    // Ẩn nếu không thuộc layer hiện tại
    if (activeLayerIdx !== layerIdx) {
      return {
        className: "opacity-0 pointer-events-none transition-all duration-500",
      };
    }

    const isActive = activeHotspotId === id;
    
    // Màu phát sáng tương ứng
    const glowColor = colorTheme === "cyan" ? "#22d3ee" :
                      colorTheme === "amber" ? "#fbbf24" :
                      colorTheme === "rose" ? "#fb7185" :
                      colorTheme === "blue" ? "#60a5fa" : "#cbd5e1"; // slate

    return {
      className: `transition-all duration-300 cursor-pointer ${isActive ? 'opacity-100 z-10' : 'opacity-30 hover:opacity-80'}`,
      style: {
        fill: isActive ? `${glowColor}66` : 'rgba(255,255,255,0.03)',
        stroke: isActive ? glowColor : 'rgba(255,255,255,0.4)',
        strokeWidth: isActive ? 4 : 2,
        strokeLinejoin: "round",
        filter: isActive ? `drop-shadow(0 0 15px ${glowColor})` : 'none',
        pointerEvents: 'auto'
      },
      onMouseEnter: () => onHover(id),
      onMouseLeave: () => onHover(null),
      onClick: () => onClick(id)
    };
  };

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center p-4">
      <svg
        viewBox="0 0 1000 400"
        className="w-full h-auto drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Lớp viền mờ (Base wireframe) - luôn hiển thị để làm nền */}
        <g className="opacity-15 pointer-events-none" stroke="white" strokeWidth="2" fill="none" strokeLinejoin="round">
          <polygon points="100,200 200,170 300,150 450,140 530,145 800,180 800,220 500,260 350,250 250,230 200,210" />
          <polygon points="450,140 500,40 530,145" />
          <polygon points="350,250 450,380 400,255" />
          <polygon points="800,180 950,80 920,200 950,320 800,220" />
        </g>

        {/* Lớp 0: Ngoại hình (cyan) */}
        <g>
          <polygon points="100,200 200,170 300,150 450,140 530,145 800,180 800,220 500,260 350,250 250,230 200,210" {...getProps('e5', 0, 'cyan')} />
          <polygon points="100,200 150,185 200,195 200,210 150,205" {...getProps('e1', 0, 'cyan')} />
          <polygon points="450,140 500,40 530,145" {...getProps('e2', 0, 'cyan')} />
          <polygon points="350,250 450,380 400,255" {...getProps('e3', 0, 'cyan')} />
          <polygon points="800,180 950,80 920,200 950,320 800,220" {...getProps('e4', 0, 'cyan')} />
        </g>

        {/* Lớp 1: Giác quan (amber) */}
        <g>
          <g {...getProps('s1', 1, 'amber')} fill="none">
            <circle cx="130" cy="195" r="4" />
            <circle cx="145" cy="202" r="3" />
            <circle cx="160" cy="190" r="2" />
          </g>
          <polyline points="300,190 400,192 500,193 600,194 700,195 800,195" strokeDasharray="8,8" fill="none" {...getProps('s2', 1, 'amber')} />
          <g {...getProps('s3', 1, 'amber')}>
            <line x1="280" y1="200" x2="270" y2="230"/>
            <line x1="290" y1="200" x2="280" y2="235"/>
            <line x1="300" y1="200" x2="290" y2="240"/>
            <line x1="310" y1="200" x2="300" y2="240"/>
            <line x1="320" y1="200" x2="310" y2="235"/>
          </g>
          <circle cx="220" cy="185" r="8" {...getProps('s4', 1, 'amber')} />
        </g>

        {/* Lớp 2: Cơ bắp (rose) */}
        <g>
          <polygon points="220,210 250,190 280,220 250,230" {...getProps('m1', 2, 'rose')} />
          <polygon points="300,150 450,140 530,145 800,180 800,195 300,190" {...getProps('m2', 2, 'rose')} />
          <polygon points="750,175 850,185 850,215 750,210" {...getProps('m3', 2, 'rose')} />
          <polygon points="350,250 400,255 380,230" {...getProps('m4', 2, 'rose')} />
        </g>

        {/* Lớp 3: Nội tạng (blue) */}
        <g>
          <polygon points="180,200 220,210 200,220" {...getProps('o1', 3, 'blue')} />
          <polygon points="240,170 270,165 280,180 250,185" {...getProps('o2', 3, 'blue')} />
          <polygon points="400,210 650,220 600,250 400,240" {...getProps('o3', 3, 'blue')} />
          <polygon points="650,200 750,205 750,230 650,220" {...getProps('o4', 3, 'blue')} />
          <polygon points="330,230 350,220 360,240 340,250" {...getProps('o5', 3, 'blue')} />
        </g>

        {/* Lớp 4: Xương sụn (slate) */}
        <g>
          <polygon points="150,185 280,160 280,190 150,200" {...getProps('b1', 4, 'slate')} />
          <polygon points="180,200 250,200 230,230 190,220" {...getProps('b2', 4, 'slate')} />
          <polyline points="280,175 400,180 600,185 800,190 900,195" strokeDasharray="15,10" fill="none" {...getProps('b3', 4, 'slate')} />
          <g {...getProps('b4', 4, 'slate')}>
            <line x1="285" y1="195" x2="275" y2="235"/>
            <line x1="295" y1="195" x2="285" y2="240"/>
            <line x1="305" y1="195" x2="295" y2="245"/>
            <line x1="315" y1="195" x2="305" y2="245"/>
            <line x1="325" y1="195" x2="315" y2="240"/>
          </g>
        </g>
      </svg>
    </div>
  );
}
