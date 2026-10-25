import {
  CoralRestoration,
  TurtleHatchlings,
  DeepSeaROV,
  BeachCleanup,
  BienDongMap,
  PacificOceanMap,
  Ocean3DBg,
  SharkGallery1,
  SharkGallery2,
  SharkGallery3,
  SharkGallery4,
} from "../assets/Images";

/**
 * Chuyên mục tin tức — tương ứng bảng `news_categories`.
 * Tên hiển thị được dịch qua locale: `news.categories.<slug>`
 */
export const NEWS_CATEGORIES = [
  { id: 1, slug: "conservation" },
  { id: 2, slug: "discovery" },
  { id: 3, slug: "east-sea" },
  { id: 4, slug: "events" },
  { id: 5, slug: "research" },
];

const category = (slug) => NEWS_CATEGORIES.find((c) => c.slug === slug);

const PACIFIC_EDITORIAL = { id: 1, full_name: "Ban biên tập Pacific" };

export const NEWS_ARTICLES = [
  // ── 1. Bài nội bộ (internal) — nổi bật ──
  {
    id: 1,
    slug: "mua-rua-no-con-dao-2026",
    title: "Mùa rùa nở tại Côn Đảo: hàng nghìn rùa con trở về đại dương",
    excerpt:
      "Đêm nào cũng vậy, các tình nguyện viên lại túc trực bên những hố ấp trứng để đưa từng chú rùa con an toàn ra biển. Đây là câu chuyện về một mùa sinh sản đầy hy vọng.",
    content: `
      <p>Khi những tia nắng đầu tiên chạm vào bờ cát, hàng chục chú rùa xanh (<em>Chelonia mydas</em>) bé xíu bắt đầu hành trình đầu đời: bò từ hố ấp ra mép nước. Mỗi chuyến đi chỉ dài vài chục mét, nhưng lại quyết định sự sống còn của cả một thế hệ.</p>
      <h2>Vì sao rùa luôn quay về nơi chúng sinh ra?</h2>
      <p>Các nhà khoa học cho rằng rùa biển ghi nhớ <strong>“dấu vân tay từ trường”</strong> của bãi biển nơi chúng nở. Hàng chục năm sau, rùa cái trưởng thành sẽ dựa vào từ trường Trái Đất để quay lại đúng bãi biển đó đẻ trứng.</p>
      <blockquote>Chỉ khoảng 1 trên 1.000 rùa con sống sót đến tuổi trưởng thành. Mỗi chú rùa được thả an toàn đều vô cùng quý giá.</blockquote>
      <h2>Những việc tình nguyện viên làm mỗi đêm</h2>
      <ul>
        <li>Tuần tra bãi biển để phát hiện rùa mẹ lên đẻ.</li>
        <li>Di dời ổ trứng có nguy cơ ngập nước về khu ấp an toàn.</li>
        <li>Ghi nhận số trứng, tỉ lệ nở và gắn thẻ theo dõi.</li>
        <li>Hướng dẫn du khách không dùng đèn flash, không chạm vào rùa.</li>
      </ul>
      <figure>
        <img src="${TurtleHatchlings}" alt="Rùa con bò ra biển lúc bình minh" />
        <figcaption>Rùa con được thả vào lúc bình minh, khi nhiệt độ cát vừa phải và ít kẻ săn mồi.</figcaption>
      </figure>
      <h2>Bạn có thể giúp gì?</h2>
      <p>Hạn chế rác thải nhựa, không mua sản phẩm làm từ mai rùa và lan tỏa kiến thức bảo tồn là những hành động nhỏ nhưng có ý nghĩa lớn với loài rùa biển.</p>
    `,
    cover_url: TurtleHatchlings,
    language: "vi",
    source_type: "internal",
    external_url: null,
    source: null,
    category: category("conservation"),
    author: PACIFIC_EDITORIAL,
    is_featured: true,
    view_count: 3842,
    published_at: "2026-10-24T08:30:00+07:00",
  },

  // ── 2. Bài nội bộ — nổi bật ──
  {
    id: 2,
    slug: "robot-lan-sau-sinh-vat-phat-quang",
    title: "Robot lặn sâu hé lộ thế giới sinh vật phát quang dưới tầng biển thẳm",
    excerpt:
      "Ở độ sâu nơi ánh sáng mặt trời không thể chạm tới, hơn 75% sinh vật tự tạo ra ánh sáng. Cùng Pacific tìm hiểu công nghệ giúp con người quan sát thế giới bí ẩn này.",
    content: `
      <p>Tầng biển thẳm (từ 4.000m trở xuống) là một trong những môi trường khắc nghiệt nhất hành tinh: tối hoàn toàn, lạnh giá và áp suất gấp hàng trăm lần trên mặt đất. Vậy mà sự sống ở đây vẫn vô cùng phong phú.</p>
      <h2>ROV — đôi mắt của con người dưới đáy biển</h2>
      <p><strong>ROV</strong> (Remotely Operated Vehicle) là robot lặn được điều khiển từ tàu nghiên cứu qua dây cáp. ROV mang theo đèn chiếu sáng, camera độ phân giải cao và cánh tay robot để lấy mẫu.</p>
      <figure>
        <img src="${DeepSeaROV}" alt="Robot lặn sâu chiếu sáng đáy biển" />
        <figcaption>Ánh đèn của ROV làm lộ ra những con sứa phát quang và hải sâm dưới đáy biển.</figcaption>
      </figure>
      <h2>Vì sao sinh vật biển sâu phát sáng?</h2>
      <ul>
        <li><strong>Săn mồi:</strong> cá cần câu dùng “mồi đèn” để dụ con mồi lại gần.</li>
        <li><strong>Ngụy trang:</strong> một số loài mực phát sáng ở bụng để hòa vào ánh sáng yếu phía trên.</li>
        <li><strong>Giao tiếp:</strong> tìm bạn tình hoặc cảnh báo kẻ thù.</li>
      </ul>
      <blockquote>Hiện tượng phát quang sinh học (bioluminescence) là hình thức giao tiếp phổ biến nhất trên Trái Đất nếu tính theo số lượng sinh vật.</blockquote>
      <p>Bạn có thể trải nghiệm hành trình lặn sâu ngay trên Pacific tại trang <a href="/ocean-depth">Độ Sâu Biển Đông</a>.</p>
    `,
    cover_url: DeepSeaROV,
    language: "vi",
    source_type: "internal",
    external_url: null,
    source: null,
    category: category("research"),
    author: PACIFIC_EDITORIAL,
    is_featured: true,
    view_count: 2975,
    published_at: "2026-10-22T19:00:00+07:00",
  },

  // ── 3. Bài nội bộ — nổi bật ──
  {
    id: 3,
    slug: "phuc-hoi-ran-san-ho",
    title: "Phục hồi rạn san hô: từng mảnh ghép nhỏ cho một đại dương khỏe mạnh",
    excerpt:
      "Rạn san hô chỉ chiếm chưa tới 1% diện tích đáy biển nhưng là nhà của khoảng 25% sinh vật biển. Kỹ thuật “vườn ươm san hô” đang mang lại hy vọng mới.",
    content: `
      <p>San hô không phải là đá hay thực vật — chúng là <strong>động vật</strong>, sống cộng sinh với tảo đơn bào. Khi nước biển nóng lên, tảo rời đi và san hô bị “tẩy trắng”, có thể chết nếu tình trạng kéo dài.</p>
      <h2>Vườn ươm san hô hoạt động như thế nào?</h2>
      <ol>
        <li>Thợ lặn thu các mảnh san hô gãy còn sống.</li>
        <li>Gắn chúng lên giàn khung kim loại đặt dưới đáy biển.</li>
        <li>Theo dõi, làm sạch tảo bám trong 6–12 tháng.</li>
        <li>Cấy san hô trưởng thành trở lại rạn tự nhiên.</li>
      </ol>
      <figure>
        <img src="${CoralRestoration}" alt="Thợ lặn cấy san hô lên giàn ươm" />
        <figcaption>Thợ lặn gắn từng mảnh san hô lên giàn ươm dưới nước.</figcaption>
      </figure>
      <blockquote>Một rạn san hô khỏe mạnh có thể giảm tới 97% năng lượng sóng, bảo vệ bờ biển khỏi xói lở.</blockquote>
      <p>Tìm hiểu thêm về các loài sống quanh rạn san hô trong mục <a href="/search">Sinh vật biển</a>.</p>
    `,
    cover_url: CoralRestoration,
    language: "vi",
    source_type: "internal",
    external_url: null,
    source: null,
    category: category("conservation"),
    author: { id: 2, full_name: "Nguyễn Minh Anh" },
    is_featured: true,
    view_count: 2210,
    published_at: "2026-10-20T10:15:00+07:00",
  },

  // ── 4. Tin ngoài (external) — tiếng Việt ──
  {
    id: 4,
    slug: "bien-dong-da-dang-sinh-hoc-vnexpress",
    title: "Biển Đông là một trong những vùng biển giàu đa dạng sinh học nhất thế giới",
    excerpt:
      "Các khảo sát gần đây tiếp tục ghi nhận thêm nhiều loài sinh vật biển mới tại vùng biển Việt Nam, khẳng định giá trị sinh thái đặc biệt của Biển Đông.",
    content: null,
    cover_url: BienDongMap,
    language: "vi",
    source_type: "external",
    external_url: "https://vnexpress.net/khoa-hoc",
    source: { id: 1, name: "VnExpress" },
    category: category("east-sea"),
    author: null,
    is_featured: true,
    view_count: 1564,
    published_at: "2026-10-23T14:20:00+07:00",
  },

  // ── 5. Bài nội bộ ──
  {
    id: 5,
    slug: "ngay-hoi-lam-sach-bo-bien",
    title: "Hơn 500 tình nguyện viên chung tay làm sạch bờ biển cuối tuần qua",
    excerpt:
      "Chỉ trong một buổi sáng, các bạn trẻ đã thu gom hàng tấn rác thải nhựa, góp phần trả lại vẻ đẹp tự nhiên cho bãi biển và bảo vệ sinh vật biển.",
    content: `
      <p>Từ 6 giờ sáng, những chiếc áo xanh đã phủ kín bờ biển. Mỗi nhóm được phát bao tải, găng tay và phiếu ghi nhận loại rác thu được.</p>
      <h2>Rác thải nhựa ảnh hưởng thế nào tới sinh vật biển?</h2>
      <p>Rùa biển thường nhầm túi nilon với sứa — thức ăn yêu thích của chúng. Vi nhựa đi vào chuỗi thức ăn và cuối cùng quay trở lại bàn ăn của con người.</p>
      <figure>
        <img src="${BeachCleanup}" alt="Tình nguyện viên nhặt rác trên bãi biển" />
        <figcaption>Tình nguyện viên phân loại rác ngay tại bãi biển.</figcaption>
      </figure>
      <h2>Kết quả đáng chú ý</h2>
      <ul>
        <li>Chai nhựa và nắp chai chiếm tỉ lệ lớn nhất.</li>
        <li>Nhiều mảnh lưới đánh cá bị bỏ lại — mối nguy cho rùa và cá heo.</li>
        <li>Rác được phân loại để tái chế thay vì chôn lấp.</li>
      </ul>
      <p>Pacific sẽ tiếp tục cập nhật lịch các sự kiện tiếp theo trong chuyên mục Sự kiện.</p>
    `,
    cover_url: BeachCleanup,
    language: "vi",
    source_type: "internal",
    external_url: null,
    source: null,
    category: category("events"),
    author: { id: 3, full_name: "Trần Quốc Bảo" },
    is_featured: false,
    view_count: 1187,
    published_at: "2026-10-19T16:45:00+07:00",
  },

  // ── 6. Tin ngoài — tiếng Anh ──
  {
    id: 6,
    slug: "global-shark-populations-mongabay",
    title: "Why protecting sharks matters for the health of the entire ocean",
    excerpt:
      "As apex predators, sharks keep marine food webs in balance. Scientists explain how declining shark numbers can ripple through coral reefs and seagrass meadows.",
    content: null,
    cover_url: SharkGallery1,
    language: "en",
    source_type: "external",
    external_url: "https://news.mongabay.com/",
    source: { id: 2, name: "Mongabay" },
    category: category("research"),
    author: null,
    is_featured: false,
    view_count: 942,
    published_at: "2026-10-21T09:00:00+07:00",
  },

  // ── 7. Bài nội bộ ──
  {
    id: 7,
    slug: "su-that-thu-vi-ve-ca-map-voi",
    title: "5 sự thật thú vị về cá mập voi — gã khổng lồ hiền lành của đại dương",
    excerpt:
      "Dài tới 12–18 mét nhưng chỉ ăn sinh vật phù du, cá mập voi là loài cá lớn nhất hành tinh và hoàn toàn vô hại với con người.",
    content: `
      <p>Cá mập voi (<em>Rhincodon typus</em>) là loài cá lớn nhất còn tồn tại. Dù mang tên “cá mập”, chúng lại là những sinh vật hiền lành bậc nhất đại dương.</p>
      <h2>1. Ăn thứ nhỏ nhất đại dương</h2>
      <p>Chúng lọc hàng nghìn lít nước mỗi giờ để ăn sinh vật phù du, trứng cá và tôm nhỏ.</p>
      <h2>2. Mỗi cá thể có “vân tay” riêng</h2>
      <p>Hoa văn chấm trắng trên lưng là duy nhất, giúp các nhà khoa học nhận diện từng cá thể qua ảnh chụp.</p>
      <h2>3. Sống rất lâu</h2>
      <p>Ước tính cá mập voi có thể sống tới 70–100 năm.</p>
      <h2>4. Di cư hàng nghìn kilômét</h2>
      <p>Chúng theo các dòng hải lưu giàu thức ăn, xuất hiện ở nhiều vùng biển nhiệt đới, trong đó có Biển Đông.</p>
      <h2>5. Đang bị đe dọa</h2>
      <p>Loài này được IUCN xếp vào nhóm <strong>Nguy cấp (EN)</strong> do đánh bắt, va chạm tàu thuyền và ô nhiễm.</p>
      <figure>
        <img src="${SharkGallery2}" alt="Cá mập dưới đại dương" />
        <figcaption>Hình minh họa: cá mập bơi giữa đại dương xanh.</figcaption>
      </figure>
      <p>Xem hồ sơ chi tiết và giải phẫu 3D tại trang <a href="/species/ca-map-voi-nham-voi">Cá mập voi</a>.</p>
    `,
    cover_url: SharkGallery2,
    language: "vi",
    source_type: "internal",
    external_url: null,
    source: null,
    category: category("discovery"),
    author: PACIFIC_EDITORIAL,
    is_featured: false,
    view_count: 2654,
    published_at: "2026-10-17T20:00:00+07:00",
  },

  // ── 8. Tin ngoài — tiếng Việt ──
  {
    id: 8,
    slug: "kham-pha-dai-duong-tuoi-tre",
    title: "Hơn 80% đại dương vẫn chưa được con người khám phá",
    excerpt:
      "Chúng ta có bản đồ bề mặt Mặt Trăng chi tiết hơn bản đồ đáy biển của chính Trái Đất. Những thách thức nào đang cản bước các nhà thám hiểm đại dương?",
    content: null,
    cover_url: Ocean3DBg,
    language: "vi",
    source_type: "external",
    external_url: "https://tuoitre.vn/",
    source: { id: 3, name: "Tuổi Trẻ" },
    category: category("discovery"),
    author: null,
    is_featured: false,
    view_count: 1320,
    published_at: "2026-10-16T07:30:00+07:00",
  },

  // ── 9. Bài nội bộ ──
  {
    id: 9,
    slug: "ban-do-sinh-thai-thai-binh-duong",
    title: "Thái Bình Dương: đại dương lớn nhất và những “điểm nóng” đa dạng sinh học",
    excerpt:
      "Trải dài hơn 165 triệu km², Thái Bình Dương chứa Tam giác San hô — khu vực có mức đa dạng sinh học biển cao nhất thế giới.",
    content: `
      <p>Thái Bình Dương rộng hơn toàn bộ diện tích đất liền trên Trái Đất cộng lại. Đây cũng là nơi có rãnh Mariana — điểm sâu nhất hành tinh với gần 11.000m.</p>
      <h2>Tam giác San hô</h2>
      <p>Nằm giữa Indonesia, Philippines, Malaysia, Papua New Guinea, Đông Timor và quần đảo Solomon, khu vực này được mệnh danh là “Amazon của đại dương”.</p>
      <figure>
        <img src="${PacificOceanMap}" alt="Bản đồ Thái Bình Dương" />
        <figcaption>Bản đồ Thái Bình Dương và các vùng biển lân cận.</figcaption>
      </figure>
      <h2>Mối liên hệ với Biển Đông</h2>
      <p>Biển Đông là biển rìa của Thái Bình Dương, đóng vai trò cầu nối sinh thái quan trọng giữa Ấn Độ Dương và Thái Bình Dương.</p>
      <p>Khám phá các điểm nóng trên bản đồ tương tác tại <a href="/">trang chủ Pacific</a>.</p>
    `,
    cover_url: PacificOceanMap,
    language: "vi",
    source_type: "internal",
    external_url: null,
    source: null,
    category: category("east-sea"),
    author: { id: 2, full_name: "Nguyễn Minh Anh" },
    is_featured: false,
    view_count: 876,
    published_at: "2026-10-14T11:00:00+07:00",
  },

  // ── 10. Tin ngoài — tiếng Anh ──
  {
    id: 10,
    slug: "noaa-marine-protection-update",
    title: "New marine protected areas aim to safeguard migratory species",
    excerpt:
      "Fisheries scientists highlight how connected networks of protected areas can help sharks, turtles and whales complete their long migrations safely.",
    content: null,
    cover_url: SharkGallery3,
    language: "en",
    source_type: "external",
    external_url: "https://www.fisheries.noaa.gov/news",
    source: { id: 4, name: "NOAA Fisheries" },
    category: category("conservation"),
    author: null,
    is_featured: false,
    view_count: 645,
    published_at: "2026-10-12T22:10:00+07:00",
  },

  // ── 11. Bài nội bộ ──
  {
    id: 11,
    slug: "pacific-ra-mat-do-thi-tri-thuc",
    title: "Pacific ra mắt Đồ thị tri thức: khám phá chuỗi thức ăn Biển Đông trực quan",
    excerpt:
      "Tính năng mới giúp bạn thấy rõ mối quan hệ săn mồi, cộng sinh và cạnh tranh giữa các loài sinh vật biển chỉ trong vài cú nhấp chuột.",
    content: `
      <p>Mỗi loài sinh vật biển đều là một mắt xích trong mạng lưới sinh thái. <strong>Đồ thị tri thức</strong> của Pacific biến những mối quan hệ phức tạp đó thành sơ đồ trực quan, dễ hiểu.</p>
      <h2>Bạn có thể làm gì với Đồ thị tri thức?</h2>
      <ul>
        <li>Xem loài nào là thiên địch, loài nào là con mồi.</li>
        <li>Lọc theo kiểu quan hệ: săn mồi, cộng sinh, ký sinh, cạnh tranh…</li>
        <li>Nhấp vào một loài để mở hồ sơ chi tiết.</li>
      </ul>
      <figure>
        <img src="${SharkGallery4}" alt="Cá mập trong hệ sinh thái" />
        <figcaption>Cá mập — loài săn mồi đầu bảng giữ cân bằng chuỗi thức ăn.</figcaption>
      </figure>
      <p>Trải nghiệm ngay tại trang <a href="/knowledge-graph">Đồ thị tri thức</a>.</p>
    `,
    cover_url: SharkGallery4,
    language: "vi",
    source_type: "internal",
    external_url: null,
    source: null,
    category: category("events"),
    author: PACIFIC_EDITORIAL,
    is_featured: false,
    view_count: 512,
    published_at: "2026-10-10T09:00:00+07:00",
  },
];
