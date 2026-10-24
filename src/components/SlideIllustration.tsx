import React from 'react';

export type IllustrationType = 
  | 'nature-exploration' 
  | 'classroom-students' 
  | 'discovery-science' 
  | 'practice-math' 
  | 'real-world-success'
  | 'thcs-linear-equation'
  | 'thcs-group-discussion'
  | 'thcs-oxy-graph'
  | 'thcs-student-hand'
  | 'thcs-market-math';

interface SlideIllustrationProps {
  type?: IllustrationType | string;
  className?: string;
}

export const SlideIllustration: React.FC<SlideIllustrationProps> = ({ 
  type = 'thcs-linear-equation', 
  className = 'w-full h-full' 
}) => {
  // 1. THCS LINEAR EQUATION: Cặp học sinh THCS chỉn chu (khăn quàng đỏ, áo trắng, bảng hệ phương trình & thước eke)
  if (type === 'thcs-linear-equation' || type === 'classroom-students') {
    return (
      <div className={`relative flex items-center justify-center p-2 ${className}`}>
        <svg viewBox="0 0 520 420" className="w-full h-full max-h-[380px] drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="chalkboardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064E3B" />
              <stop offset="100%" stopColor="#022C22" />
            </linearGradient>
            <linearGradient id="boardFrame" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="skinBoy" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>
            <linearGradient id="skinGirl" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFE4E6" />
              <stop offset="100%" stopColor="#FECDD3" />
            </linearGradient>
            <linearGradient id="uniformBlue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="redScarf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND: BẢNG TỪ TOÁN HỌC THCS VỚI LƯỚI TỌA ĐỘ */}
          <rect x="25" y="20" width="470" height="250" rx="14" fill="url(#boardFrame)" stroke="#451A03" strokeWidth="3" />
          <rect x="35" y="30" width="450" height="230" rx="10" fill="url(#chalkboardGrad)" />
          
          {/* Lưới ô vuông bảng phấn mờ */}
          <g opacity="0.15" stroke="#FFFFFF" strokeWidth="0.8">
            <path d="M 60 30 V 260 M 110 30 V 260 M 160 30 V 260 M 210 30 V 260 M 260 30 V 260 M 310 30 V 260 M 360 30 V 260 M 410 30 V 260 M 460 30 V 260" />
            <path d="M 35 60 H 485 M 35 100 H 485 M 35 140 H 485 M 35 180 H 485 M 35 220 H 485" />
          </g>

          {/* Nội dung toán học phấn trắng trên bảng */}
          {/* Trục Oxy nhỏ góc bảng */}
          <g opacity="0.85">
            <line x1="80" y1="180" x2="220" y2="180" stroke="#FDE047" strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1="150" y1="230" x2="150" y2="60" stroke="#FDE047" strokeWidth="2" />
            <text x="215" y="195" fill="#FDE047" fontSize="12" fontWeight="bold" fontFamily="serif">x</text>
            <text x="156" y="70" fill="#FDE047" fontSize="12" fontWeight="bold" fontFamily="serif">y</text>
            <text x="138" y="195" fill="#FDE047" fontSize="11" fontFamily="serif">O</text>
            {/* Đường thẳng d: ax + by = c */}
            <line x1="90" y1="210" x2="210" y2="90" stroke="#38BDF8" strokeWidth="2.5" />
            <text x="175" y="105" fill="#38BDF8" fontSize="11" fontWeight="bold">d: ax+by=c</text>
          </g>

          {/* Công thức hệ phương trình trên bảng */}
          <g transform="translate(250, 50)">
            <rect x="0" y="0" width="220" height="95" rx="8" fill="#065F46" fillOpacity="0.4" stroke="#34D399" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="18" y="26" fill="#34D399" fontSize="11" fontWeight="bold" letterSpacing="1">HỆ PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN</text>
            {/* Dấu ngoặc nhọn hệ phương trình */}
            <path d="M 22 40 Q 15 56 24 64 Q 15 72 22 88" stroke="#FBBF24" strokeWidth="3" fill="none" strokeLinecap="round" />
            <text x="32" y="55" fill="#FFFFFF" fontSize="14" fontFamily="serif" fontWeight="bold">a₁x + b₁y = c₁</text>
            <text x="32" y="80" fill="#FFFFFF" fontSize="14" fontFamily="serif" fontWeight="bold">a₂x + b₂y = c₂</text>
          </g>

          {/* NỀN ĐẤT / SÀN PHÒNG HỌC */}
          <ellipse cx="260" cy="405" rx="230" ry="14" fill="#CBD5E1" opacity="0.6" />

          {/* ================================================================ */}
          {/* HỌC SINH 1: NỮ SINH THCS (BÊN TRÁI) - ĐỒNG PHỤC ÁO TRẮNG KHĂN QUÀNG ĐỎ */}
          {/* ================================================================ */}
          <g transform="translate(60, 110)">
            {/* Chân & Giày */}
            <path d="M 85 220 L 75 285 L 105 285 L 105 220 Z" fill="#FEE2E2" />
            <path d="M 125 220 L 135 285 L 165 285 L 145 220 Z" fill="#FEE2E2" />
            <ellipse cx="90" cy="285" rx="18" ry="9" fill="#1E3A8A" />
            <ellipse cx="90" cy="282" rx="14" ry="4" fill="#FFFFFF" />
            <ellipse cx="150" cy="285" rx="18" ry="9" fill="#1E3A8A" />
            <ellipse cx="150" cy="282" rx="14" ry="4" fill="#FFFFFF" />

            {/* Váy xếp ly xanh tím than chuẩn học sinh THCS */}
            <path d="M 70 160 L 160 160 L 175 225 L 55 225 Z" fill="url(#uniformBlue)" />
            <path d="M 85 160 L 75 225 M 105 160 L 100 225 M 125 160 L 130 225 M 145 160 L 155 225" stroke="#1E293B" strokeWidth="2" opacity="0.5" />

            {/* Áo sơ mi trắng có cổ bẻ */}
            <path d="M 75 90 L 155 90 L 160 165 L 70 165 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Cổ áo polo/sơ mi trắng */}
            <path d="M 95 90 L 115 108 L 100 115 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
            <path d="M 135 90 L 115 108 L 130 115 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
            
            {/* KHĂN QUÀNG ĐỎ ĐỘI VIÊN THCS VIỆT NAM */}
            <path d="M 112 108 L 102 145 L 115 142 L 122 150 L 118 108 Z" fill="url(#redScarf)" />
            <circle cx="115" cy="110" r="5" fill="#DC2626" />

            {/* Cánh tay trái cầm thước eke kẻ bảng */}
            <path d="M 80 100 Q 50 125 55 160" stroke="url(#skinGirl)" strokeWidth="14" strokeLinecap="round" />
            {/* Thước Eke tam giác vàng */}
            <polygon points="35,160 65,130 65,175" fill="#FBBF24" stroke="#D97706" strokeWidth="2" opacity="0.9" />
            <circle cx="55" cy="155" r="4" fill="#FFFFFF" opacity="0.8" />

            {/* Cánh tay phải chỉ lên bảng phấn (Chỉ vào nghiệm) */}
            <path d="M 150 100 Q 185 85 200 60" stroke="url(#skinGirl)" strokeWidth="13" strokeLinecap="round" />
            <circle cx="202" cy="58" r="7" fill="url(#skinGirl)" />

            {/* Khuôn mặt rạng rỡ, tóc buộc gọn gàng */}
            <ellipse cx="115" cy="55" rx="28" ry="30" fill="url(#skinGirl)" />
            {/* Tóc đen mượt, mái ngang tuổi THCS */}
            <path d="M 86 52 C 84 15 146 15 144 52 C 144 65 138 70 134 60 C 128 35 102 35 96 60 Z" fill="#0F172A" />
            {/* Đuôi tóc buộc nơ đỏ */}
            <path d="M 85 45 Q 65 65 70 95 Q 85 75 88 50 Z" fill="#0F172A" />
            <circle cx="83" cy="50" r="5" fill="#EF4444" />

            {/* Mắt to tròn thông minh, nụ cười tươi */}
            <ellipse cx="106" cy="52" rx="3.5" ry="4.5" fill="#0F172A" />
            <circle cx="107" cy="50" r="1.5" fill="#FFFFFF" />
            <ellipse cx="124" cy="52" rx="3.5" ry="4.5" fill="#0F172A" />
            <circle cx="125" cy="50" r="1.5" fill="#FFFFFF" />
            <path d="M 110 65 Q 115 72 120 65" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="98" cy="62" rx="4" ry="2" fill="#FB7185" opacity="0.6" />
            <ellipse cx="132" cy="62" rx="4" ry="2" fill="#FB7185" opacity="0.6" />
          </g>

          {/* ================================================================ */}
          {/* HỌC SINH 2: NAM SINH THCS (BÊN PHẢI) - CẦM MÁY TÍNH CASIO FX-580 */}
          {/* ================================================================ */}
          <g transform="translate(300, 115)">
            {/* Quần tây xanh tím than chuẩn học sinh THCS */}
            <path d="M 65 170 L 55 280 L 85 280 L 85 170 Z" fill="url(#uniformBlue)" />
            <path d="M 95 170 L 95 280 L 125 280 L 115 170 Z" fill="url(#uniformBlue)" />
            <ellipse cx="70" cy="282" rx="18" ry="8" fill="#1E3A8A" />
            <ellipse cx="70" cy="280" rx="14" ry="3" fill="#FFFFFF" />
            <ellipse cx="110" cy="282" rx="18" ry="8" fill="#1E3A8A" />
            <ellipse cx="110" cy="280" rx="14" ry="3" fill="#FFFFFF" />

            {/* Áo sơ mi trắng */}
            <path d="M 50 85 L 130 85 L 125 175 L 55 175 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Cổ áo sơ mi */}
            <path d="M 75 85 L 90 102 L 80 110 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
            <path d="M 105 85 L 90 102 L 100 110 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
            
            {/* KHĂN QUÀNG ĐỎ ĐỘI VIÊN THCS VIỆT NAM */}
            <path d="M 88 102 L 80 140 L 92 138 L 98 144 L 92 102 Z" fill="url(#redScarf)" />
            <circle cx="90" cy="103" r="5" fill="#DC2626" />

            {/* Tay trái cầm máy tính cầm tay Casio fx-580VN X */}
            <path d="M 55 95 Q 35 125 45 155" stroke="url(#skinBoy)" strokeWidth="14" strokeLinecap="round" />
            {/* Chi tiết máy tính Casio nhỏ */}
            <rect x="25" y="145" width="28" height="42" rx="4" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" transform="rotate(10 25 145)" />
            <rect x="28" y="148" width="22" height="12" rx="2" fill="#67E8F9" opacity="0.8" transform="rotate(10 28 148)" />

            {/* Tay phải cầm phấn trắng viết lên bảng */}
            <path d="M 125 95 Q 145 65 130 35" stroke="url(#skinBoy)" strokeWidth="13" strokeLinecap="round" />
            {/* Cục phấn trắng */}
            <rect x="127" y="30" width="10" height="4" rx="1.5" fill="#FFFFFF" transform="rotate(-30 127 30)" />

            {/* Đầu & Khuôn mặt nam sinh thông minh */}
            <ellipse cx="90" cy="50" rx="28" ry="30" fill="url(#skinBoy)" />
            {/* Tóc ngắn nam sinh năng động */}
            <path d="M 62 45 C 60 12 120 12 118 45 C 115 50 108 35 90 35 C 75 35 65 48 62 45 Z" fill="#1E293B" />
            
            {/* Mắt & Nụ cười */}
            <ellipse cx="80" cy="48" rx="3.5" ry="4.5" fill="#0F172A" />
            <circle cx="81" cy="46" r="1.5" fill="#FFFFFF" />
            <ellipse cx="98" cy="48" rx="3.5" ry="4.5" fill="#0F172A" />
            <circle cx="99" cy="46" r="1.5" fill="#FFFFFF" />
            <path d="M 84 62 Q 90 68 96 62" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* BADGE NỔI BẬT: TOÁN 9 CHUẨN KẾT NỐI TRI THỨC */}
          <g transform="translate(195, 340)">
            <rect x="0" y="0" width="130" height="34" rx="17" fill="#0284C7" stroke="#BAE6FD" strokeWidth="2" filter="url(#softGlow)" />
            <circle cx="18" cy="17" r="10" fill="#FBBF24" />
            <text x="14" y="21" fill="#78350F" fontSize="12" fontWeight="bold">9</text>
            <text x="36" y="22" fill="#FFFFFF" fontSize="12" fontWeight="bold" letterSpacing="0.5">TOÁN 9 • KNTT</text>
          </g>
        </svg>
      </div>
    );
  }

  // 2. THCS GROUP DISCUSSION: Thảo luận nhóm đôi với phiếu học tập & MTCT
  if (type === 'thcs-group-discussion' || type === 'practice-math') {
    return (
      <div className={`relative flex items-center justify-center p-2 ${className}`}>
        <svg viewBox="0 0 520 420" className="w-full h-full max-h-[380px] drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="deskWood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="scG" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
          </defs>

          {/* BÀN HỌC SINH THCS BẰNG GỖ */}
          <rect x="50" y="240" width="420" height="24" rx="6" fill="url(#deskWood)" stroke="#78350F" strokeWidth="2" />
          <rect x="80" y="264" width="12" height="130" rx="3" fill="#334155" />
          <rect x="428" y="264" width="12" height="130" rx="3" fill="#334155" />
          <line x1="80" y1="340" x2="440" y2="340" stroke="#475569" strokeWidth="4" />

          {/* SÁCH GIÁO KHOA TOÁN 9 & PHIẾU HỌC TẬP TRÊN BÀN */}
          <rect x="210" y="225" width="100" height="25" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
          <text x="220" y="241" fill="#0369A1" fontSize="10" fontWeight="bold">TOÁN 9 (TẬP 1)</text>
          {/* Máy tính Casio fx-580 */}
          <rect x="330" y="222" width="45" height="28" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />
          <rect x="335" y="225" width="35" height="10" rx="2" fill="#67E8F9" />

          {/* BÓNG HỘI THOẠI TOÁN HỌC (THẢO LUẬN NGHIỆM) */}
          <g transform="translate(160, 40)">
            <path d="M 20 20 H 180 A 16 16 0 0 1 196 36 V 90 A 16 16 0 0 1 180 106 H 60 L 30 125 V 106 H 20 A 16 16 0 0 1 4 90 V 36 A 16 16 0 0 1 20 20 Z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
            <text x="24" y="52" fill="#0369A1" fontSize="13" fontWeight="bold">Cặp số (x₀; y₀) là nghiệm</text>
            <text x="24" y="74" fill="#0F172A" fontSize="12">khi ax₀ + by₀ = c đúng!</text>
            <text x="24" y="94" fill="#16A34A" fontSize="11" fontWeight="bold">✓ Thử cặp (2; 1) vào 2x+y=5</text>
          </g>

          {/* HỌC SINH 1: NỮ SINH (TRÁI) VỚI KHĂN QUÀNG ĐỎ */}
          <g transform="translate(90, 100)">
            <ellipse cx="50" cy="50" rx="26" ry="28" fill="#FED7AA" />
            <path d="M 24 45 C 24 15 76 15 76 45 C 76 55 70 60 65 52 C 60 30 40 30 35 52 Z" fill="#1E293B" />
            <ellipse cx="42" cy="48" rx="3" ry="4" fill="#0F172A" />
            <ellipse cx="58" cy="48" rx="3" ry="4" fill="#0F172A" />
            <path d="M 45 60 Q 50 66 55 60" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
            {/* Áo trắng + khăn đỏ */}
            <path d="M 20 80 L 80 80 L 85 145 L 15 145 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <path d="M 46 95 L 42 125 L 52 123 L 56 128 L 52 95 Z" fill="url(#scG)" />
            <circle cx="50" cy="96" r="4" fill="#DC2626" />
          </g>

          {/* HỌC SINH 2: NAM SINH (PHẢI) VỚI KHĂN QUÀNG ĐỎ */}
          <g transform="translate(330, 100)">
            <ellipse cx="50" cy="50" rx="26" ry="28" fill="#FED7AA" />
            <path d="M 24 45 C 24 15 76 15 76 45 C 72 50 68 35 50 35 C 36 35 28 48 24 45 Z" fill="#0F172A" />
            <ellipse cx="42" cy="48" rx="3" ry="4" fill="#0F172A" />
            <ellipse cx="58" cy="48" rx="3" ry="4" fill="#0F172A" />
            <path d="M 46 60 Q 50 66 54 60" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
            {/* Áo trắng + khăn đỏ */}
            <path d="M 20 80 L 80 80 L 85 145 L 15 145 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <path d="M 46 95 L 42 125 L 52 123 L 56 128 L 52 95 Z" fill="url(#scG)" />
            <circle cx="50" cy="96" r="4" fill="#DC2626" />
          </g>
        </svg>
      </div>
    );
  }

  // 3. THCS OXY GRAPH: Minh họa hình học hệ 2 phương trình bậc nhất hai ẩn
  if (type === 'thcs-oxy-graph' || type === 'discovery-science') {
    return (
      <div className={`relative flex items-center justify-center p-2 ${className}`}>
        <svg viewBox="0 0 520 420" className="w-full h-full max-h-[380px] drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* NỀN MÀN HÌNH TƯƠNG TÁC THÔNG MINH */}
          <rect x="20" y="20" width="480" height="380" rx="16" fill="#0F172A" stroke="#1E293B" strokeWidth="3" />
          
          {/* LƯỚI TỌA ĐỘ OXY */}
          <g opacity="0.25" stroke="#38BDF8" strokeWidth="1">
            <line x1="60" y1="60" x2="60" y2="360" />
            <line x1="120" y1="60" x2="120" y2="360" />
            <line x1="180" y1="60" x2="180" y2="360" />
            <line x1="240" y1="60" x2="240" y2="360" />
            <line x1="300" y1="60" x2="300" y2="360" />
            <line x1="360" y1="60" x2="360" y2="360" />
            <line x1="420" y1="60" x2="420" y2="360" />
            
            <line x1="40" y1="100" x2="480" y2="100" />
            <line x1="40" y1="160" x2="480" y2="160" />
            <line x1="40" y1="220" x2="480" y2="220" />
            <line x1="40" y1="280" x2="480" y2="280" />
            <line x1="40" y1="340" x2="480" y2="340" />
          </g>

          {/* TRỤC TỌA ĐỘ CHÍNH */}
          <line x1="50" y1="220" x2="460" y2="220" stroke="#F8FAFC" strokeWidth="3" />
          <polygon points="468,220 456,214 456,226" fill="#F8FAFC" />
          <text x="460" y="242" fill="#F8FAFC" fontSize="16" fontWeight="bold">x</text>

          <line x1="240" y1="370" x2="240" y2="50" stroke="#F8FAFC" strokeWidth="3" />
          <polygon points="240,42 234,54 246,54" fill="#F8FAFC" />
          <text x="252" y="60" fill="#F8FAFC" fontSize="16" fontWeight="bold">y</text>
          
          <text x="225" y="242" fill="#F8FAFC" fontSize="15" fontWeight="bold">O</text>

          {/* ĐƯỜNG THẲNG d1: 2x - y = 1 (VÀNG CAM) */}
          <line x1="120" y1="360" x2="360" y2="80" stroke="#FB923C" strokeWidth="4" />
          <text x="350" y="70" fill="#FB923C" fontSize="14" fontWeight="bold">d₁: 2x - y = 1</text>

          {/* ĐƯỜNG THẲNG d2: x + y = 5 (XANH CYAN) */}
          <line x1="120" y1="100" x2="400" y2="340" stroke="#38BDF8" strokeWidth="4" />
          <text x="390" y="360" fill="#38BDF8" fontSize="14" fontWeight="bold">d₂: x + y = 5</text>

          {/* ĐIỂM GIAO ĐIỂM M(2; 3) - NGHIỆM DUY NHẤT */}
          <circle cx="280" cy="180" r="10" fill="#EF4444" stroke="#FFFFFF" strokeWidth="3" />
          <line x1="280" y1="180" x2="280" y2="220" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
          <line x1="280" y1="180" x2="240" y2="180" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
          
          <rect x="285" y="140" width="165" height="34" rx="8" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
          <text x="295" y="162" fill="#FCA5A5" fontSize="13" fontWeight="bold">Giao điểm M(2; 3)</text>
          <text x="274" y="238" fill="#EF4444" fontSize="12" fontWeight="bold">x=2</text>
          <text x="210" y="185" fill="#EF4444" fontSize="12" fontWeight="bold">y=3</text>
        </svg>
      </div>
    );
  }

  // 4. THCS STUDENT HAND: Nữ sinh THCS giơ tay phát biểu tự tin với khăn quàng đỏ
  if (type === 'thcs-student-hand') {
    return (
      <div className={`relative flex items-center justify-center p-2 ${className}`}>
        <svg viewBox="0 0 520 420" className="w-full h-full max-h-[380px] drop-shadow-lg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shG" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
            <linearGradient id="bgCircle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>

          {/* Hào quang nền phòng học */}
          <circle cx="260" cy="210" r="160" fill="url(#bgCircle)" />
          <ellipse cx="260" cy="385" rx="180" ry="16" fill="#94A3B8" opacity="0.3" />

          {/* BÀN HỌC THCS */}
          <rect x="90" y="270" width="340" height="20" rx="5" fill="#D97706" stroke="#92400E" strokeWidth="2" />
          <rect x="110" y="290" width="10" height="95" fill="#475569" />
          <rect x="400" y="290" width="10" height="95" fill="#475569" />

          {/* VỞ GHI TOÁN & BÚT */}
          <rect x="130" y="258" width="70" height="20" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" />
          <text x="138" y="272" fill="#0369A1" fontSize="9" fontWeight="bold">VỞ TOÁN 9</text>
          <line x1="210" y1="262" x2="235" y2="262" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />

          {/* NỮ SINH THCS ĐEO KHĂN QUÀNG ĐỎ */}
          <g transform="translate(180, 50)">
            {/* Thân & Váy */}
            <path d="M 60 210 L 120 210 L 135 280 L 45 280 Z" fill="#1E3A8A" />
            {/* Áo trắng có cổ */}
            <path d="M 50 140 L 130 140 L 120 215 L 60 215 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
            
            {/* KHĂN QUÀNG ĐỎ ĐỘI VIÊN */}
            <path d="M 85 152 L 75 190 L 88 188 L 94 195 L 90 152 Z" fill="url(#shG)" />
            <circle cx="87" cy="154" r="5" fill="#DC2626" />

            {/* Tay trái tì trên bàn */}
            <path d="M 55 155 Q 35 190 45 225" stroke="#FED7AA" strokeWidth="15" strokeLinecap="round" />

            {/* TAY PHẢI GIƠ CAO TỰ TIN PHÁT BIỂU! */}
            <path d="M 125 150 Q 155 100 170 45" stroke="#FED7AA" strokeWidth="16" strokeLinecap="round" />
            {/* Bàn tay xòe 5 ngón phát biểu */}
            <circle cx="172" cy="40" r="9" fill="#FED7AA" />
            <path d="M 168 32 L 168 22" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" />
            <path d="M 173 32 L 175 20" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" />
            <path d="M 178 35 L 183 24" stroke="#FED7AA" strokeWidth="4" strokeLinecap="round" />

            {/* Khuôn mặt rạng rỡ, nụ cười tươi */}
            <ellipse cx="90" cy="100" rx="32" ry="34" fill="#FED7AA" />
            {/* Mái tóc đen buộc cao năng động */}
            <path d="M 58 95 C 56 50 124 50 122 95 C 118 105 110 80 90 80 C 70 80 62 105 58 95 Z" fill="#0F172A" />
            {/* Đuôi tóc cột nơ đỏ */}
            <path d="M 60 85 Q 40 105 45 140 Q 58 120 62 90 Z" fill="#0F172A" />
            <circle cx="58" cy="90" r="6" fill="#EF4444" />

            {/* Mắt to tròn sáng ngời */}
            <ellipse cx="80" cy="98" rx="4" ry="5.5" fill="#0F172A" />
            <circle cx="81" cy="96" r="1.8" fill="#FFFFFF" />
            <ellipse cx="102" cy="98" rx="4" ry="5.5" fill="#0F172A" />
            <circle cx="103" cy="96" r="1.8" fill="#FFFFFF" />
            <path d="M 85 112 Q 91 122 97 112" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="72" cy="110" rx="5" ry="2.5" fill="#FB7185" opacity="0.6" />
            <ellipse cx="110" cy="110" rx="5" ry="2.5" fill="#FB7185" opacity="0.6" />
          </g>

          {/* BONG BÓNG Ý TƯỞNG TOÁN HỌC */}
          <g transform="translate(320, 40)">
            <ellipse cx="50" cy="30" rx="50" ry="25" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <text x="18" y="35" fill="#B45309" fontSize="13" fontWeight="bold">Em xin phát biểu!</text>
            <circle cx="20" cy="62" r="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="10" cy="74" r="3" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
          </g>
        </svg>
      </div>
    );
  }

  // 5. Default / Real world success
  return (
    <div className={`relative flex items-center justify-center p-2 ${className}`}>
      <svg viewBox="0 0 520 420" className="w-full h-full max-h-[380px] drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="30" width="460" height="360" rx="20" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="3" />
        <circle cx="260" cy="180" r="110" fill="#EFF6FF" />
        {/* Biểu tượng Toán 9 THCS */}
        <text x="185" y="160" fill="#1D4ED8" fontSize="48" fontWeight="bold" fontFamily="serif">ax + by = c</text>
        <rect x="150" y="230" width="220" height="44" rx="22" fill="#2563EB" />
        <text x="180" y="258" fill="#FFFFFF" fontSize="16" fontWeight="bold">TOÁN 9 • THCS MỸ HÓA</text>
      </svg>
    </div>
  );
};

export default SlideIllustration;
