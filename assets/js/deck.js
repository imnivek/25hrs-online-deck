/* ============================================================
   25HRS 線上分享會簡報　Deck Engine
   v1.0 / 2026-07-29
   規範：01_CIS / 02_互動與動效規範 / 03_結構藍圖 / 05_講者內容分項
   ============================================================ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SVGNS = 'http://www.w3.org/2000/svg';
const el = (t, a = {}, p) => { const n = document.createElementNS(SVGNS, t);
  for (const k in a) n.setAttribute(k, a[k]); if (p) p.appendChild(n); return n; };

/* ══════════ 1. 資料層 ══════════ */

// 十大案例。三軸資料一律 ≤ 18 字（CIS §8-B.2）
const CASES = [
  { id:'nvidia', chart:'bridge', stats:[['$40K','初始資金'], ['$3 Tn','市值'], ['100%','純代工零競爭']], m1:'自掏 4 萬美元', m2:'現金流養研發', m3:'絕不與客戶競爭', co:'NVIDIA 輝達', person:'黃仁勳', icon:'i08', deep:true,
    sub:'短期難看的財報，換長期唯一的位置',
    face:{hair:'short', glasses:false, collar:'leather'},
    a1:'4 萬美元自掏　→　紅杉天使輪',
    a2:'用顯卡現金流硬撐 CUDA，頂住華爾街',
    a3:'Fabless 絕不與客戶競爭，一封信換數十年代工',
    key:'當年被罵財務毒藥的決策，是今天唯一的護城河' },
  { id:'tsmc', chart:'counter', stats:[['48%','國家基金出資'], ['CAPEX','逆勢資本支出'], ['0','自有產品']], m1:'國發基金 48%', m2:'逆勢擴產', m3:'不做自有產品', co:'台積電 TSMC', person:'張忠謀', icon:'i05', deep:true,
    sub:'別人恐慌縮編時擴產，靠的是看得懂現金流',
    face:{hair:'white', glasses:true, collar:'suit'},
    a1:'國發基金出資近 48%　＋　園區免稅',
    a2:'精算折舊與自由現金流，金融風暴逆勢擴產',
    a3:'Pure-play 絕不推自有產品，讓對手敢交出命脈',
    key:'把商業模式設計成絕對利他，信任才長得出來' },
  { id:'spacex', chart:'milestone', stats:[['$396M','里程碑補助'], ['3','次破產級失敗'], ['80%','成本降幅']], m1:'里程碑式補助', m2:'火箭回收降本', m3:'公開失敗數據', co:'SpaceX', person:'伊隆·馬斯克', icon:'i17', deep:true,
    sub:'敢公開失敗，才拿得到下一張合約',
    face:{hair:'swept', glasses:false, collar:'tee'},
    a1:'NASA COTS 3.96 億美元競賽型里程碑補助',
    a2:'三次發射失敗險破產，靠回收算出單位經濟',
    a3:'直播失敗爆炸畫面，用不隱瞞換軍方信任',
    key:'達成技術指標才給錢，逼出了極致的成本控制' },
  { id:'dyson', chart:'milestone', stats:[['1','筆政府擔保貸款'], ['5,127','次失敗原型'], ['100%','家族全資持有']], m1:'政策擔保貸款', m2:'不釋股撐研發', m3:'親自拆機示範', co:'Dyson 戴森', person:'詹姆士·戴森', icon:'i04', deep:true,
    sub:'政策性貸款，是被銀行拒絕之後的那條路',
    face:{hair:'white', glasses:false, collar:'shirt'},
    a1:'銀行全拒　→　英國政府小企業貸款擔保計畫',
    a2:'5,127 次失敗，堅持不釋股，高毛利覆蓋研發',
    a3:'創辦人親自拆機當代言，工程透明度換信任',
    key:'不釋出股權，是為了不必向短期壓力低頭' },
  { id:'airbnb', chart:'valley', stats:[['$30K','賣麥片籌資'], ['$2B','緊急債務融資'], ['$1M','房東保障金']], m1:'YC 孵化器種子', m2:'砍非核心重組', m3:'雙向評價與保險', co:'Airbnb', person:'布萊恩·切斯基', icon:'i15', deep:true,
    sub:'危機時砍得夠深，才活得夠久',
    face:{hair:'short', glasses:false, collar:'tee'},
    a1:'賣包裝麥片籌 3 萬美元　→　YC 孵化器',
    a2:'疫情營收歸零，砍光非核心＋20 億美元債務重組',
    a3:'雙向評價＋100 萬美元房東保障，把信任制度化',
    key:'讓陌生人敢住進陌生人家裡的，是制度不是交情' },
  { id:'tesla', chart:'valley', stats:[['$465M','政府救命貸款'], ['$1.79B','年度碳權純利'], ['0','專利訴訟']], m1:'能源部低利貸款', m2:'碳權補上利潤', m3:'開放全部專利', co:'Tesla 特斯拉', person:'伊隆·馬斯克', icon:'i07', deep:false,
    sub:'先算得出單位成本，才談得起願景',
    face:{hair:'swept', glasses:false, collar:'suit'},
    a1:'2008 年美國能源部 4.65 億美元低利貸款續命',
    a2:'造車成本高於售價後重塑財務模型，靠碳權轉正',
    a3:'2014 年開放全部專利，零訴訟承諾',
    key:'開放專利換來的，是整個產業願意站到同一邊' },
  { id:'alibaba', chart:'shield', stats:[['50萬','人民幣公寓起家'], ['VIE','資本架構'], ['100%','擔保交易保障']], m1:'軟銀 2000 萬美元', m2:'引入 CFO 立紀律', m3:'支付寶擔保交易', co:'Alibaba 阿里巴巴', person:'馬雲', icon:'i09', deep:false,
    sub:'不懂財務就找懂的人，別自己硬撐',
    face:{hair:'thin', glasses:false, collar:'suit'},
    a1:'十八羅漢湊 50 萬人民幣　→　軟銀 2000 萬美元',
    a2:'燒錢失控，引入蔡崇信建立 VIE 與財務紀律',
    a3:'支付寶擔保交易，用制度解決社會信任死穴',
    key:'承認自己不懂，是他做過最有金融素養的決定' },
  { id:'tencent', chart:'shield', stats:[['$2.2M','天使輪'], ['50%','半條命交給夥伴'], ['兆級','投資生態系']], m1:'IDG 天使輪', m2:'轉向資本配置', m3:'只給流量不干涉', co:'Tencent 騰訊', person:'馬化騰', icon:'i09', deep:false,
    sub:'不做的事，決定您能長多大',
    face:{hair:'short', glasses:true, collar:'suit'},
    a1:'IDG 與盈科 220 萬美元天使輪救伺服器',
    a2:'從「什麼都自己做」轉向資本配置，投京東美團',
    a3:'只給流量不干涉營運，把半條命交給夥伴',
    key:'放棄壟斷，換來一整個生態系心甘情願加入' },
  { id:'moderna', chart:'valley', stats:[['$1B','曲速行動補助'], ['10','年無營收研發'], ['100%','第三方數據審核']], m1:'政府預購補助', m2:'無稀釋性資本', m3:'第三方審數據', co:'Moderna 莫德納', person:'史蒂芬·班塞爾', icon:'i04', deep:false,
    sub:'補助款，是不稀釋股權的錢',
    face:{hair:'short', glasses:false, collar:'suit'},
    a1:'DARPA 研發補助　＋　曲速行動近 10 億美元',
    a2:'十年無營收死亡之谷，用無稀釋性資本保股權',
    a3:'臨床數據交第三方獨立委員會公開審查',
    key:'放棄商業機密的保護，換各國政府提前買單' },
  { id:'irobot', chart:'bridge', stats:[['SBIR','國防補助款'], ['B2G→B2C','商業模式翻轉'], ['軍規','信任轉移']], m1:'SBIR 國防補助', m2:'B2G 轉 B2C', m3:'軍規技術背書', co:'iRobot', person:'柯林·安格爾', icon:'i06', deep:false,
    sub:'靠補助起家，但不能靠補助活著',
    face:{hair:'short', glasses:true, collar:'shirt'},
    a1:'國防部與 SBIR 專案補助起家',
    a2:'B2G 撥款慢致現金流斷裂，轉 B2C 救活週轉',
    a3:'軍規技術降維進家庭，硬實力直接換信任',
    key:'政府訂單給您技術，消費市場才給您現金流' }
];

const POLL_Q0 = { opts:[
  { k:'A', t:'錢　資金卡住了' },
  { k:'B', t:'人　找不到對的夥伴' },
  { k:'C', t:'通路　東西賣不出去' },
  { k:'D', t:'門道　知道有路但進不去' }
], pct:[34, 22, 16, 28], answer:null };

// 金融素養識別（合規改寫版，見 05_講者內容分項 §4.2）
const QUIZ = [
  { k:'A', t:'自動代操<br><b>每月穩定</b>套利 2%', flags:3,
    why:'「每月」＋「穩定」＋「代操」。這三個詞同時出現，先停下來。' },
  { k:'B', t:'境外年金型商品<br>年配息 9%', flags:1, q:true,
    why:'不是紅的也不是綠的。差別不在商品，<b>在您有沒有那條渠道</b>。' },
  { k:'C', t:'海外商辦包租<br>年化 17%，綁約 5 年', flags:3,
    why:'報酬最高、標的最遠、綁約最久。三個一起來的時候，通常不是機會。' },
  { k:'D', t:'美元定存<br>年化 3.5%', flags:0, ok:true,
    why:'最無聊的那一個，也是唯一您今天下午就能查清楚的那一個。' }
];

const MIRRORS = [
  ['誰在保管您的錢？', '金流走銀行體系，還是走某個私人帳戶'],
  ['在哪一國、受哪個主管機關監理？', '查得到牌照，才有申訴的地方'],
  ['報酬從哪來？誰在付這個利息？', '說不清楚來源的收益，來源通常是下一個人'],
  ['出場條件是什麼？', '綁約幾年、能不能提前贖回、贖回付多少'],
  ['「穩定」「保證」「保本」出現幾次？', '出現越多次，越該退一步']
];

const CHAPTERS = ['Kevin　開場','Kevin　三種資本','Kevin　十大案例','Rebecca　政府補助',
  'Ainstein　政策性貸款','Andy　金融素養','Kevin　信任與圈層','Kevin　俱樂部與收單'];

// 四位共同創辦人（職稱與資歷依 v260723 原 PPT）
const FOUNDERS = {
  rebecca:{ role:'營運長', nm:'Rebecca', co:'準行顧問有限公司 負責人', axis:0,
    hook:'我在 NVIDIA 管供應鏈專利。<br>今天第一個案例，就是 NVIDIA。',
    cv:['政府補助顧問','NVIDIA 供應鏈專利主管','台大法律背景','AI 應用落地'] },
  ainstein:{ role:'執行長', nm:'Ainstein', co:'愛鑫斯坦科技有限公司', axis:0,
    hook:'我有兩張專利證書。<br>一張是智能交易系統，<br>另一張是把交易變成遊戲。',
    cv:['華碩電腦 電競軟體部 高級工程師','交通大學 多媒體工程所','臺灣師範大學 數學系',
        '新型專利 M598465 智能交易系統','新型專利 M683802 遊戲化智能金融交易系統'] },
  andy:{ role:'投資長', nm:'Andy', co:'亞特國際資訊顧問有限公司 執行長', axis:1,
    hook:'我看過的部位，規模逾千億。<br>所以我很清楚，<br>一般人被騙的話術長什麼樣子。',
    cv:['新光金控 海外投資分析師','全球資產配置 / 宏觀研究','固定收益策略','法人投資經驗，管理資產規模逾千億'] },
  kevin:{ role:'行銷長', nm:'Kevin', co:'優點行銷整合有限公司', axis:2,
    hook:'我是做行銷的。<br>所以我最清楚什麼叫<br>「很熱鬧，但沒人真的認識您」。',
    cv:['師大 衛教 / 企管','品牌行銷','成長策略與市場開發','數位轉型'] }
};



// 年度活動總藍圖 2026.08 到 2027.07（來源：俱樂部行銷活動部門 年度活動總藍圖）
const YEAR = [
  { m:'08', salon:'開幕．體感破冰之夜', club:'第一場　運動競技餐酒', season:'入場' },
  { m:'09', salon:'餐酒城市夜談',       club:'',                  season:'入場' },
  { m:'10', salon:'潑畫療癒體驗夜',     club:'第二場　品味鑑賞',     season:'品味' },
  { m:'11', salon:'KTV 星光歡唱夜',     club:'',                  season:'品味' },
  { m:'12', salon:'年終感恩大聚',       club:'第三場　尊榮私宴',     season:'尊榮', peak:1 },
  { m:'01', salon:'新春桌遊策略賽',     club:'',                  season:'尊榮' },
  { m:'02', salon:'運動球類日',         club:'第四場　戶外莊園',     season:'競技' },
  { m:'03', salon:'財商輕沙龍',         club:'',                  season:'競技' },
  { m:'04', salon:'能量與天賦體驗夜',   club:'第五場　風格鑑賞',     season:'風格' },
  { m:'05', salon:'餐酒微聚',           club:'',                  season:'風格' },
  { m:'06', salon:'夏日戶外輕運動',     club:'第六場　年度尊榮盛典', season:'盛典' },
  { m:'07', salon:'週年桌遊嘉年華',     club:'',                  season:'盛典', peak:1 }
];
const CLUB6 = [
  { n:'第一場', m:'2026.08', t:'運動競技餐酒', d:'紅酒 × 室內高爾夫 × 高級餐點',
    hi:'從服裝到伴手禮，每個細節都是儀式感' },
  { n:'第二場', m:'2026.10', t:'品味鑑賞', d:'垂直品酒會',
    hi:'限量編號酒款、侍酒師故事、餐酒搭配。可延伸威士忌與雪茄' },
  { n:'第三場', m:'2026.12', t:'尊榮私宴', d:'歲末私廚私宴',
    hi:'署名邀請、精選席次、主廚上桌，一年結束在最尊榮的餐桌' },
  { n:'第四場', m:'2027.02', t:'戶外莊園', d:'高爾夫邀請賽或馬術莊園日',
    hi:'一整天的戶外行程，獎項與排名帶來真實的競技張力' },
  { n:'第五場', m:'2027.04', t:'風格鑑賞', d:'遊艇私宴或藝術珠寶鑑賞',
    hi:'稀缺場域本身即價值，帶出會員的生活風格與身份認同' },
  { n:'第六場', m:'2027.06', t:'年度尊榮盛典', d:'週年會員盛典',
    hi:'一年一次，所有人回到同一張桌子' }
];
// Salon 六大主題（情緒目標 × 場地 × 滿足需求）
const SALON_CAT = [
  { img:'salon-1', t:'體感競技 / 桌遊', e:'歡樂．競技．破冰', v:'閃動格子 CyberCube 南港',  need:'男性競技　社群分享' },
  { img:'salon-2', t:'餐酒微聚 / 城市夜談', e:'深聊．有情調', v:'童裏心柑仔店．Barn Detour' },
  { img:'salon-3', t:'體驗療癒', e:'療癒．儀式感', v:'大天才潑畫沙龍 Datensai' },
  { img:'salon-4', t:'KTV 歡唱', e:'熱絡．放鬆', v:'1884（包廂＋湯屋＋夜景）' },
  { img:'salon-5', t:'運動球類', e:'活力．家庭友善', v:'羽球館．球類場地' },
  { img:'salon-6', t:'財商 / 能量輕沙龍', e:'有料又輕鬆', v:'餐敘場＋天賦數字工具' }
];
// Salon 十二場排程（含招募設計）
const SALON12 = [
  ['2026.08','開幕．體感破冰之夜','體感競技','開幕首場，建立第一印象，鼓勵帶 1 位朋友',1],
  ['2026.09','餐酒城市夜談','餐酒微聚','深聊型，認識彼此的事業',0],
  ['2026.10','潑畫療癒體驗夜','體驗療癒','女性儀式感強，短影音素材佳',0],
  ['2026.11','KTV 星光歡唱夜','KTV 歡唱','高互動的破冰神場',0],
  ['2026.12','年終感恩大聚','餐酒微聚','帶朋友高峰，年度重聚',2],
  ['2027.01','新春桌遊策略賽','體感競技','老帶新、默契養成',0],
  ['2027.02','運動球類日','運動球類','家庭友善，擴散生活圈',0],
  ['2027.03','財商輕沙龍','財商輕沙龍','自然帶入的漏斗場',0],
  ['2027.04','能量與天賦體驗夜','財商 / 能量','天賦數字工具互動，情緒價值',0],
  ['2027.05','餐酒微聚','餐酒微聚','質感升溫，過渡夏季',0],
  ['2027.06','夏日戶外輕運動','運動球類','戶外，朋友一起來',0],
  ['2027.07','週年桌遊嘉年華','體感競技','滿一年會員見證，招募旺季',2]
];
const SALON6 = [
  { img:'salon-1', t:'桌遊之夜' }, { img:'salon-2', t:'餐酒夜談' }, { img:'salon-3', t:'潑畫療癒夜' },
  { img:'salon-4', t:'KTV 星光夜' }, { img:'salon-5', t:'運動球類日' }, { img:'salon-6', t:'財商輕沙龍' }
];

// 25HRS 微型創投師計劃：四種形式 × 四位講師（v260723 p58 到 p62）
const PLAN = [
  { t:'入門講座', h:'2 HRS',            d:'四位講師各講一段，先把全貌給您' },
  { t:'線上培訓', h:'9 HRS ／ 9 章',    d:'隨時可看，半年內無限免費複訓' },
  { t:'實戰陪跑', h:'8 HRS／場 × 半年', d:'不是聽課。是帶著您自己的案子一起做' },
  { t:'顧問諮詢', h:'1 HR × 8 次',      d:'一對一，談的是您自己的公司' }
];
const PLAN_BY = [
  { nm:'Andy',    role:'投資長', img:'andy',
    rows:['財商思維與財務規劃','CH1 財商思維　CH2 價值投資','理財規劃　資產配置','資產配置顧問'] },
  { nm:'Ainstein', role:'執行長', img:'AINSTEIN',
    rows:['從投資家到創業家','CH3 價值衍生金融　CH4 價差合約交易<br>CH5 神州群英匯　CH6 政策性貸款',
          '槓桿金融與量化交易<br>政策性貸款（ESG｜SWOT｜商業模式）','量化金融顧問'] },
  { nm:'Rebecca', role:'營運長', img:'rebecca',
    rows:['盤點創業資源','CH7 資格型補助　CH8 競爭型補助','政府補助案<br>（WLB｜SBIR｜SIIR｜SITI）','政府補助顧問'] },
  { nm:'Kevin',   role:'行銷長', img:'kevin',
    rows:['創投家俱樂部','CH9 數位轉型','創投沙龍　數位轉型','數位轉型顧問'] }
];

// 價值堆疊（v260723 p66 逐項明細）
const VALUE = [
  { t:'微型創業資源', n:260000, items:[
    ['政策性貸款', 50000], ['政府補助案', 60000], ['政府補助企劃顧問陪跑服務', 150000] ] },
  { t:'微型投資資源', n:500000, items:[
    ['專業投資理財與財商完整培訓', 300000], ['專利金融交易投資輔助軟體使用權', 200000] ] },
  { t:'BONUS', n:120000, items:[
    ['半年無限免費複訓', 0], ['25HRS CLUB 一年會員資格', 20000], ['限量 90 天商模實習創投家陪跑', 100000] ] }
];
// 正式對外的兩個方案（v260723 p68．終生會員價）
const TIERS = [
  { k:'ELITE',   nm:'菁英方案', hrs:'12 HRS', n:39800,
    items:[['線上培訓','9 HRS'], ['顧問諮詢','1 HR × 3 次']], full:false },
  { k:'PREMIUM', nm:'尊榮方案', hrs:'25 HRS', n:88800,
    items:[['線上培訓','9 HRS'], ['實體陪跑','8 HRS／次 × 半年'], ['顧問諮詢','1 HR × 8 次']], full:true }
];
const PRICE = [
  { lb:'菁英方案 ELITE 12HRS',   n:39800, cut:true },
  { lb:'尊榮方案 PREMIUM 25HRS', n:88800, cut:true },
  { lb:'本場限定．封測創始夥伴價', n:16800, cut:false }
];

/* ══════════ 2. 肖像徽章（自繪 SVG，同一幾何基底＋各人識別特徵） ══════════ */

function medallion(f, size = 200) {
  const hair = {
    short : 'M38 46c2-16 10-24 22-24s20 8 22 24c-6-8-13-11-22-11s-16 3-22 11z',
    swept : 'M37 46c1-17 11-25 24-25 10 0 17 5 21 13-8-4-16-3-24 1-7 3-14 5-21 11z',
    white : 'M37 48c1-18 11-26 23-26s22 8 23 26c-5-9-8-12-12-12-5 0-8 3-11 3s-6-3-11-3c-4 0-8 3-12 12z',
    thin  : 'M40 43c3-13 10-19 20-19s17 6 20 19c-6-6-12-8-20-8s-14 2-20 8z',
    curly : 'M36 46c-2-14 8-26 24-26s26 12 24 26c-4-5-8-4-11-8-4 4-9 5-13 5s-9-1-13-5c-3 4-7 3-11 8z'
  }[f.hair] || 'M38 46c2-16 10-24 22-24s20 8 22 24c-6-8-13-11-22-11s-16 3-22 11z';

  const collar = {
    leather: '<path d="M46 80l14 16 14-16"/><path d="M40 84l6-6M80 84l-6-6"/>',
    suit   : '<path d="M48 79l12 15 12-15"/><path d="M60 94v18"/><path d="M56 88l4 6 4-6"/>',
    tee    : '<path d="M46 80c5 6 23 6 28 0"/>',
    shirt  : '<path d="M50 79l10 12 10-12"/><path d="M60 91v16"/>'
  }[f.collar] || '';

  const glasses = f.glasses
    ? '<circle cx="51" cy="52" r="7.5"/><circle cx="69" cy="52" r="7.5"/><path d="M58.5 52h3"/><path d="M43.5 51l-4-1M76.5 51l4-1"/>'
    : '';

  return `<svg class="medallion" viewBox="0 0 120 120" width="${size}" height="${size}">
    <circle cx="60" cy="60" r="57" class="m-ring"/>
    <circle cx="60" cy="60" r="53" class="m-fill"/>
    <clipPath id="mc-${f.id}"><circle cx="60" cy="60" r="53"/></clipPath>
    <g clip-path="url(#mc-${f.id})" class="m-line">
      <path d="M22 118c0-24 17-36 38-36s38 12 38 36"/>
      <path d="M54 74v9c0 3 12 3 12 0v-9"/>
      <ellipse cx="60" cy="52" rx="19" ry="23"/>
      <path d="${hair}"/>
      ${glasses}
      <path d="M53 60c2 2 5 2 7 0"/>
      ${collar}
    </g>
    <circle cx="60" cy="60" r="53" class="m-inner"/>
  </svg>`;
}

/* ══════════ 3. 舞台縮放 ══════════ */

const stage = $('#stage');
function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.setProperty('--scale', s);
}
addEventListener('resize', fit); fit();

/* ══════════ 4. 建立案例頁 ══════════ */

// 三軸三層：大關鍵字（資本名） → 短名（記憶點） → 一句話
const AXIS = [
  { n:'①', big:'資源', en:'RESOURCE', nm:'拿得到', icon:'i19', cls:'axis--1' },
  { n:'②', big:'財商', en:'FINANCE',  nm:'用得對', icon:'i20', cls:'axis--2' },
  { n:'③', big:'信任', en:'TRUST',    nm:'走得遠', icon:'i21', cls:'axis--3' }
];

// 引起動機文字雲：全部都是這場後面會被回答的問題（lv 決定字級）
const CLOUD = [
  { t:'您缺的不是努力',              lv:3, ax:0 },
  { t:'馬斯克也拿過政府的錢',        lv:2, ax:1 },
  { t:'台積電近一半是國家出的',      lv:2, ax:1 },
  { t:'戴森被銀行全部拒絕過',        lv:1, ax:1 },
  { t:'青創貸款，一輩子只能拿一次？', lv:2, ax:1 },
  { t:'不缺錢，也該去借',            lv:1, ax:1 },
  { t:'政府是您最大的客戶',          lv:1, ax:1 },
  { t:'開公司的唯一目的是什麼',      lv:2, ax:1 },
  { t:'有賺錢，帳上卻沒錢',          lv:3, ax:2 },
  { t:'高槓桿＝高風險？',            lv:2, ax:2 },
  { t:'9% 配息，是機會還是陷阱',     lv:2, ax:2 },
  { t:'最危險的是看起來像機會的',    lv:1, ax:2 },
  { t:'老闆的錢跟公司的錢',          lv:1, ax:2 },
  { t:'他們找夥伴的方式不一樣',      lv:3, ax:3 },
  { t:'換了幾百張名片，然後呢',      lv:2, ax:3 },
  { t:'不擅長社交就沒救了嗎',        lv:1, ax:3 },
  { t:'把半條命交給對手',            lv:1, ax:3 }
];

/* 五種資訊圖表原型（viewBox 620×230），資料驅動指派給十個案例 */
const CHARTS = {
  // 現金流灌進研發：左方塊 → 匯流 → 右方塊
  bridge: (a, b) => `<svg class="cchart" viewBox="0 0 900 230">
    <rect class="cbox" x="12" y="116" width="272" height="64" rx="10"/>
    <text class="clb" x="148" y="155">${a}</text>
    <path class="cflow" d="M284 148 H436 C496 148 496 76 556 76 H628"/>
    <path class="cflow c2" d="M284 166 H496 C556 166 556 104 616 104 H628"/>
    <rect class="cbox cbox--lit" x="628" y="44" width="260" height="88" rx="10"/>
    <text class="clb clb--lit" x="758" y="95">${b}</text>
    <path class="carrow" d="M616 76 l16 -8 v16 z"/></svg>`,
  // 死亡幽谷：先跌破再爬升過原點
  valley: (a, b) => `<svg class="cchart" viewBox="0 0 900 230">
    <path class="caxis" d="M44 202 H880 M44 18 V202"/>
    <path class="cdash" d="M44 108 H880"/>
    <path class="cline" d="M50 102 C200 108 268 198 376 192 C480 186 528 118 616 82 C704 46 790 36 878 30"/>
    <circle class="cdot cdot--low" cx="374" cy="192" r="7"/>
    <text class="clb clb--sm" x="374" y="220">${a}</text>
    <circle class="cdot" cx="876" cy="30" r="7"/>
    <text class="clb clb--sm clb--lit" x="800" y="18">${b}</text></svg>`,
  // 絕對利益隔離：中間一道牆，兩邊互不越界
  shield: (a, b) => `<svg class="cchart" viewBox="0 0 900 230">
    <rect class="cbox" x="20" y="62" width="288" height="104" rx="10"/>
    <text class="clb" x="164" y="120">${a}</text>
    <rect class="cbox cbox--lit" x="592" y="62" width="288" height="104" rx="10"/>
    <text class="clb clb--lit" x="736" y="120">${b}</text>
    <path class="cwall" d="M450 18 V210"/>
    <path class="cwall cwall--soft" d="M430 34 V194 M470 34 V194"/>
    <path class="cflow" d="M308 96 H410"/><path class="carrow" d="M410 96 l16 -8 v16 z"/>
    <path class="cflow" d="M592 134 H490"/><path class="carrow" d="M490 134 l-16 -8 v16 z"/></svg>`,
  // 里程碑撥款：達標才亮的階梯
  milestone: (a, b) => `<svg class="cchart" viewBox="0 0 900 230">
    <path class="caxis" d="M44 204 H880"/>
    ${[0,1,2,3].map(i => `<g class="mstep">
      <rect class="cbox${i === 3 ? ' cbox--lit' : ''}" x="${70 + i*206}" y="${176 - i*42}" width="168" height="${24 + i*42}" rx="8"/>
      <circle class="cdot${i === 3 ? '' : ' cdot--dim'}" cx="${154 + i*206}" cy="${172 - i*42}" r="7"/>
    </g>`).join('')}
    <text class="clb clb--sm" x="154" y="222">${a}</text>
    <text class="clb clb--sm clb--lit" x="772" y="22">${b}</text></svg>`,
  // 逆勢：市場下墜，您上揚
  counter: (a, b) => `<svg class="cchart" viewBox="0 0 900 230">
    <path class="caxis" d="M44 202 H880 M44 18 V202"/>
    <path class="cline cline--dim" d="M50 66 L182 36 L284 122 L386 66 L488 152 L600 108 L740 182 L876 198"/>
    <path class="cline" d="M50 178 C220 174 300 150 396 118 C516 80 660 52 876 30"/>
    <text class="clb clb--sm" x="206" y="28">${a}</text>
    <text class="clb clb--sm clb--lit" x="748" y="20">${b}</text></svg>`
};
const CHART_LB = {
  nvidia:['遊戲顯卡現金流','CUDA 研發'], irobot:['國防專案補助','B2C 現金流'],
  tesla:['造車成本高於售價','碳權轉正'], airbnb:['疫情營收歸零','史上最高利潤率'],
  moderna:['十年無營收','各國政府預購'], alibaba:['買家','賣家'], tencent:['流量與基建','被投夥伴'],
  spacex:['第一階段','拿下後續合約'], dyson:['原型失敗','量產'], tsmc:['市場景氣週期','逆勢資本支出']
};

function buildCases() {
  const mount = $('#casesMount');
  CASES.forEach((c, i) => {
    const s = document.createElement('section');
    s.className = 'slide s-case' + (c.deep ? '' : ' s-case--flash');
    s.dataset.chap = 3; s.dataset.case = c.id;
    const [la, lb] = CHART_LB[c.id] || ['', ''];
    s.innerHTML = `<div class="slide-in">
      <div class="case">
        <figure class="case-plate">
          <img src="assets/img/cases/${c.id}.webp" alt="${c.person}">
          <figcaption><b>${c.person}</b><span>${c.co}</span></figcaption>
        </figure>
        <div class="case-txt">
          <span class="kicker">案例 ${String(i + 1).padStart(2, '0')}${c.deep ? '' : '　快閃'}　${c.sub}</span>
          <div class="cstats">
            ${c.stats.map(([v, l]) => `<div class="cstat"><b>${v}</b><span>${l}</span></div>`).join('')}
          </div>
          <div class="cchart-wrap">${CHARTS[c.chart](la, lb)}</div>
          <div class="axes axes--case">
            ${AXIS.map((a, k) => `<div class="axis ${a.cls}" data-axis-i="${k}">
              <svg class="ic ic-32" viewBox="0 0 24 24"><use href="#${a.icon}"/></svg>
              <span class="nm"><b>${a.big}</b>${a.nm}</span>
              <span class="desc">${c['a' + (k + 1)]}</span>
            </div>`).join('')}
          </div>
          <p class="quote case-key">「${c.key}」</p>
        </div>
      </div>
    </div>`;
    mount.parentNode.insertBefore(s, mount);
  });
  mount.remove();
}

function buildMatrix() {
  const t = $('#matrix'); if (!t) return;
  t.innerHTML = `<thead><tr><th style="width:220px">公司</th>
    <th>① 拿得到</th><th>② 用得對</th><th>③ 走得遠</th></tr></thead><tbody>${
    CASES.map(c => `<tr><td>${c.co.split(' ')[0]}</td>
      <td>${c.m1}</td><td>${c.m2}</td><td>${c.m3}</td></tr>`).join('')
  }</tbody>`;
}

/* ══════════ 5. 進度鐘盤 ══════════ */

const FRAG_TOTAL = 8;
let fragments = 0;

function drawClock(svg, lit, big) {
  if (!svg) return;
  svg.innerHTML = '';
  const cx = 50, cy = 50, r = 38;
  el('circle', { cx, cy, r, fill:'none', stroke:'var(--line-hair)', 'stroke-width':'1.5' }, svg);
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const on = i < lit * 3;
    const r1 = r - (i % 6 === 0 ? 8 : 5), r2 = r - 1;
    el('line', {
      x1: cx + Math.cos(a) * r1, y1: cy + Math.sin(a) * r1,
      x2: cx + Math.cos(a) * r2, y2: cy + Math.sin(a) * r2,
      stroke: on ? 'var(--gold-500)' : 'rgba(214,177,106,.16)',
      'stroke-width': i % 6 === 0 ? 2.4 : 1.6, 'stroke-linecap':'round',
      class: on ? 'tick-on' : ''
    }, svg);
  }
  if (lit >= FRAG_TOTAL) {
    const a = -Math.PI / 2 + 0.13;
    el('line', { x1: cx + Math.cos(a) * (r + 3), y1: cy + Math.sin(a) * (r + 3),
      x2: cx + Math.cos(a) * (r + 11), y2: cy + Math.sin(a) * (r + 11),
      stroke:'var(--gold-300)', 'stroke-width':'2.6', 'stroke-linecap':'round', class:'tick-25' }, svg);
    el('circle', { cx: cx + Math.cos(a) * (r + 14), cy: cy + Math.sin(a) * (r + 14), r:2.2,
      fill:'var(--gold-300)', class:'tick-25' }, svg);
  }
  if (big) {
    el('line', { x1:cx, y1:cy, x2:cx, y2:cy - r + 10, stroke:'var(--gold-500)',
      'stroke-width':'1.6', 'stroke-linecap':'round' }, svg);
    el('circle', { cx, cy, r:2, fill:'var(--gold-500)' }, svg);
  }
}

function addFragment() {
  if (fragments >= FRAG_TOTAL) return;
  fragments++;
  drawClock($('#clock'), fragments);
  const c = $('#clock');
  c.classList.remove('pulse'); void c.offsetWidth; c.classList.add('pulse');
}

/* 自動播頁碼：資訊型頁面，進頁後自己依序鋪開，講者不必點
   手動頁保留給「停頓本身就是內容」的揭曉、反轉、投票與收單 */
const AUTO_PAGES = new Set([3,4,6,10,11,12,27,28,35,37,38,42,43,44,45,46,48,53,56,
  60,61,62,63,64,65,70,71,72,74,75,76,77,79,81,83,84,85,86,92,93,94]);
const AUTO_GAP = 520;

function clearAuto(s) { (s._auto || []).forEach(clearTimeout); s._auto = []; }
function autoPlay(s) {
  clearAuto(s);
  const max = maxStep(s); if (!max) return;
  if (REDUCED) { step = max; applyStep(s, max); return; }
  s._auto = [];
  for (let k = 1; k <= max; k++)
    s._auto.push(setTimeout(() => {
      if (slides[cur] !== s) return;
      step = k; applyStep(s, k);
      if (k === max) s._auto = [];
    }, k * AUTO_GAP));
}

/* ══════════ 6. 導覽引擎 ══════════ */

let slides = [], cur = 0, step = 0, blackedOut = false;

// ⚠ data-xxx 無值時 dataset.xxx === ''（falsy），一律用 has() 判斷存在與否
const has = (s, k) => s.dataset[k] !== undefined;

// 各互動頁的總步數
const STEPS = { cloud:1, axisloop:4, case:0, matrix:2, fail:3, rotary:2, iobox:2, stack:4,
  esbi:4, puzzle:4, quiz:5, mirrors:5, fade10:2, recall:3, ladder:6, seats:2,
  poll:2, why:1, whyopen:4, b2g:3, anchor:1, valuestack:5, price:4,
  plan:5, planby:5, year:3, club6:3, salon6:2, tiers:3, countdown:1 };

function maxStep(s) {
  if (has(s, 'flip')) return +s.dataset.flip + 1;
  if (has(s, 'video')) return 0;   // 影片頁不佔步數，→ 直接翻頁
  for (const k in STEPS) if (has(s, k)) return STEPS[k];
  return +(s.dataset.steps || 0);
}

function applyStep(s, n) {
  $$('.reveal', s).forEach(r => r.classList.toggle('is-revealed', +r.dataset.step <= n));
  const h = HANDLERS[Object.keys(HANDLERS).find(k => s.dataset[k] !== undefined)];
  if (h) h(s, n);
}

function show(i, dir = 1) {
  const prev = slides[cur], next = slides[i];
  if (!next) return;
  const chapChanged = next.dataset.sweep !== undefined;

  if (prev && prev !== next) {
    if (prev.dataset.video !== undefined) stopVideo(prev);
    (prev._seq || []).forEach(clearTimeout); prev._seq = [];
    clearAuto(prev);
    prev.classList.add('slide--out');
    setTimeout(() => { prev.classList.remove('is-active', 'slide--out'); }, REDUCED ? 60 : 240);
  }
  const enter = () => {
    next.classList.add('is-active', 'slide--in');
    setTimeout(() => next.classList.remove('slide--in'), 700);
    cur = i; step = 0; applyStep(next, 0); updateChrome();
    if (next.dataset.sweep !== undefined && !REDUCED) runSweep();
    if (AUTO_PAGES.has(i + 1)) autoPlay(next);
  };

  if (chapChanged && !REDUCED) { setTimeout(enter, 180); }
  else if (!REDUCED && prev !== next) { runWipe(); setTimeout(enter, 200); }
  else enter();
}

function runWipe() {
  const w = $('#wipe'); w.classList.remove('is-running'); void w.offsetWidth; w.classList.add('is-running');
}
function runSweep() {
  const s = $('#sweep');
  const g = $('#sweepTicks'); g.innerHTML = '';
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
    const l = el('line', { x1:50 + Math.cos(a) * 32, y1:50 + Math.sin(a) * 32,
      x2:50 + Math.cos(a) * 38, y2:50 + Math.sin(a) * 38,
      stroke:'var(--gold-500)', 'stroke-width':'1.4', 'stroke-linecap':'round',
      opacity:0 }, g);
    setTimeout(() => l.setAttribute('opacity', 1), 120 + i * 18);
  }
  s.classList.remove('is-running'); void s.offsetWidth; s.classList.add('is-running');
}

function next() {
  const s = slides[cur];
  if (s._auto && s._auto.length) {          // 自動播still跑著：一鍵跳到終態
    clearAuto(s); step = maxStep(s); applyStep(s, step); return;
  }
  if (step < maxStep(s)) { step++; applyStep(s, step); }
  else if (cur < slides.length - 1) show(cur + 1, 1);
}
function prev() {
  const s = slides[cur];
  if (step > 0) { step--; applyStep(s, step); }
  else if (cur > 0) { show(cur - 1, -1); const p = slides[cur]; step = maxStep(p); applyStep(p, step); }
}

function updateChrome() {
  const s = slides[cur], ch = +s.dataset.chap || 1;
  $('#chapNow').textContent = String(ch).padStart(2, '0');
  $('#pagenum').textContent = String(cur + 1).padStart(2, '0');
  $$('#dots .dot').forEach((d, i) => {
    d.classList.toggle('is-current', i === ch - 1);
    d.classList.toggle('is-seen', i < ch - 1);
  });
  $('#chrome').classList.toggle('is-hidden', s.classList.contains('s-cover') || s.classList.contains('s-qa'));
}

/* ══════════ 7. 各頁互動 ══════════ */

const HANDLERS = {

  poll(s, n) {
    const box = $('#pollq0', s); if (!box) return;
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = POLL_Q0.opts.map((o, i) =>
        `<div class="bar" data-i="${i}"><div class="fill"></div>
         <span class="opt"><b>${o.k}</b>　${o.t}</span><span class="cnt">${POLL_Q0.pct[i]}%</span></div>`).join('');
    }
    $$('.bar', box).forEach((b, i) => {
      b.querySelector('.fill').style.width = n >= 1 ? POLL_Q0.pct[i] + '%' : '0%';
      b.querySelector('.cnt').style.opacity = n >= 1 ? 1 : 0;
      b.classList.toggle('is-answer', n >= 1 && POLL_Q0.pct[i] === Math.max(...POLL_Q0.pct));
    });
    s.classList.toggle('show-punch', n >= 2);
    if (n === 2) addFragment();
  },

  // 順序：① 三張問題卡先在場上 ② 講師出場（指定誰答） ③ 講師逐張翻開解答
  flip(s, n) {
    s.classList.toggle('show-handoff', n >= 1);
    $$('.myth', s).forEach((m, i) => m.classList.toggle('is-flipped', i < n - 1));
    s.classList.toggle('show-punch', n > +s.dataset.flip);
  },

  axisloop(s, n) {
    const box = $('.axisloop', s); if (!box) return;
    if (!box.dataset.built) { box.dataset.built = 1; box.innerHTML = axisLoopSVG(); }
    for (let k = 0; k < 3; k++) box.querySelector('#al-n' + k).classList.toggle('is-on', n > k);
    for (let k = 0; k < 3; k++) { box.querySelector('#al-a' + k).classList.toggle('is-on', n > k + 1);
      box.querySelector('#al-h' + k).classList.toggle('is-on', n > k + 1); }
    box.querySelector('#al-core').classList.toggle('is-on', n >= 4);
    box.classList.toggle('is-flowing', n >= 4);
    if (n === 4 && !has(s, 'final')) addFragment();
  },

  // 案例頁：按一次就自動依序彈出（數字圖表 → 三軸 → 金句），不需要一直點
  // 案例頁：一進頁就自動依序彈出，講者完全不必點；→ 直接翻下一頁
  case(s) {
    (s._seq || []).forEach(clearTimeout); s._seq = [];
    const axes = $$('.axis', s);
    const set = k => {
      s.classList.toggle('show-data', k >= 1);
      axes.forEach((a, i) => a.classList.toggle('is-on', i < k - 1));
      s.classList.toggle('show-key', k >= 5);
    };
    set(0);
    if (REDUCED) { set(5); return; }
    [ [1, 120], [2, 400], [3, 640], [4, 880], [5, 1240] ].forEach(([k, ms]) =>
      s._seq.push(setTimeout(() => { if (slides[cur] === s) set(k); }, ms)));
  },

  matrix(s, n) {
    const rows = $$('#matrix tbody tr', s);
    rows.forEach((r, i) => setTimeout(() => r.classList.toggle('is-on', n >= 1), n >= 1 ? i * 120 : 0));
    s.classList.toggle('show-concl', n >= 2);
    if (n === 2) addFragment();
  },

  fail(s, n) {
    $$('.num[data-count]', s).forEach(el2 => {
      if (n >= 1 && !el2.dataset.done) { el2.dataset.done = 1; countTo(el2, +el2.dataset.count); }
      if (n < 1) { el2.textContent = '0'; delete el2.dataset.done; }
    });
    const c = $('#failchart', s);
    if (n >= 2 && !c.dataset.built) { c.dataset.built = 1; drawFailChart(c); }
    c.classList.toggle('is-on', n >= 2);
    s.classList.toggle('show-punch', n >= 3);
  },

  rotary(s, n) {
    const r = $('#rotary', s);
    if (!r.dataset.built) { r.dataset.built = 1; drawRotary(r); }
    r.classList.toggle('is-split', n >= 1);
    s.classList.toggle('show-seed', n >= 2);
    if (n === 2) addFragment();
  },

  iobox(s, n) {
    $('#ioBox', s).classList.toggle('is-clear', n >= 1);
    s.classList.toggle('show-punch', n >= 2);
  },

  stack(s, n) {
    $$('.scard', s).forEach((c, i) => c.classList.toggle('is-on', i < n));
    $('#stackcards', s).classList.toggle('is-fanned', n >= 3);
    s.classList.toggle('show-punch', n >= 4);
  },

  esbi(s, n) {
    const g = $('#esbi', s);
    if (!g.dataset.built) { g.dataset.built = 1; drawESBI(g); }
    g.classList.toggle('st1', n >= 1);
    g.classList.toggle('st2', n >= 2);
    g.classList.toggle('st3', n >= 3);
    s.classList.toggle('show-punch', n >= 4);
  },

  puzzle(s, n) {
    const st = $('#puzzleStage', s);
    if (!st.dataset.built) { st.dataset.built = 1; st.innerHTML = puzzleSVG(); }
    for (let k = 0; k < 3; k++) st.querySelector('#pz' + k).classList.toggle('is-in', n > k);
    st.classList.toggle('is-morphed', n >= 3);
    s.classList.toggle('show-punch', n >= 3);
    s.classList.toggle('show-founders', n >= 4);
    if (n === 3) addFragment();
  },

  quiz(s, n) {
    const g = $('#quizgrid', s);
    if (!g.dataset.built) {
      g.dataset.built = 1;
      g.innerHTML = QUIZ.map((q, i) => `<div class="qcard" data-i="${i}">
        <div class="qk">${q.k}</div><div class="qt">${q.t}</div>
        <div class="qflags">${'<svg class="ic ic-32 ic--clay flag" viewBox="0 0 24 24"><use href="#iflag"/></svg>'.repeat(q.flags)}
          ${q.q ? '<svg class="ic ic-32 ic--azure flag" viewBox="0 0 24 24"><use href="#iq"/></svg>' : ''}
          ${q.ok ? '<svg class="ic ic-32 ic--jade flag" viewBox="0 0 24 24"><use href="#ick"/></svg>' : ''}</div>
        <div class="qwhy">${q.why}</div></div>`).join('');
    }
    $$('.qcard', g).forEach((c, i) => {
      const on = i < n;
      c.classList.toggle('is-revealed', on);
      $$('.flag', c).forEach((f, k) => setTimeout(() => f.classList.toggle('is-up', on), on ? k * 180 : 0));
    });
    s.classList.toggle('show-punch', n >= 5);
  },

  mirrors(s, n) {
    const box = $('#mirrors', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = MIRRORS.map((m, i) => `<div class="mirror">
        <span class="mno">${String(i + 1).padStart(2, '0')}</span>
        <div><b class="h3">${m[0]}</b><p class="small">${m[1]}</p></div></div>`).join('');
    }
    $$('.mirror', box).forEach((m, i) => m.classList.toggle('is-on', i < n));
    if (n === 5) addFragment();
  },

  fade10(s, n) {
    const box = $('#faces10', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = CASES.map(c => `<div class="f10">${medallion({ ...c.face, id:'f' + c.id }, 120)}
        <span>${c.person}</span></div>`).join('');
    }
    box.classList.toggle('is-faded', n >= 1);
    s.classList.toggle('show-punch', n >= 1);
    if (n === 2) addFragment();
  },

  recall(s, n) {
    s.classList.toggle('st1', n >= 1);
    s.classList.toggle('st2', n >= 2);
    s.classList.toggle('st3', n >= 3);
  },

  ladder(s, n) {
    $$('.ladder .step', s).forEach((st, i) => {
      st.classList.toggle('is-on', i < n); st.classList.toggle('is-off', i >= n);
    });
    $('#legacyBeam', s).classList.toggle('is-running', n >= 6);
    s.classList.toggle('show-punch', n >= 6);
    if (n === 6) addFragment();
  },

  seats(s, n) {
    const g = $('#seats', s);
    if (!g.dataset.built) { g.dataset.built = 1; drawSeats(g); }
    if (n >= 1) $$('.seat', g).forEach((c, i) => setTimeout(() => {
      if (i < 12) c.classList.add('is-taken');
    }, i * 120));
    else $$('.seat', g).forEach(c => c.classList.remove('is-taken'));
    s.classList.toggle('show-cta', n >= 2);
  },

  // WHY 提問頁：一句問題，刻意留白，第二步才出提示
  why(s, n) { s.classList.toggle('show-punch', n >= 1); },

  // 為什麼要開公司：三個常見答案逐一被劃掉
  whyopen(s, n) {
    $$('.wo-card', s).forEach((c, i) => c.classList.toggle('is-out', i < n));
    s.classList.toggle('show-punch', n >= 4);
  },

  // B2G 三層漏斗：由外而內點亮
  b2g(s, n) {
    const g = $('#b2g', s);
    if (!g.dataset.built) {
      g.dataset.built = 1;
      const R = [[190,'B2C',20],[130,'B2B',16],[72,'B2G',15]];
      R.forEach(([r, lb, fs], i) => {
        const gg = el('g', { class:'ring r' + i }, g);
        el('circle', { cx:220, cy:220, r, fill:'none', stroke:'var(--line-soft)', 'stroke-width':1.6 }, gg);
        const t = el('text', { x:220, y:220 - r + fs + 12, 'text-anchor':'middle', class:'rlb' }, gg);
        t.textContent = lb;
      });
    }
    $$('.ring', g).forEach((r, i) => r.classList.toggle('is-on', i < n));
    s.classList.toggle('show-punch', n >= 3);
  },

  // 段末錨點：三軸縮小圖，只亮這一段補的那一軸
  anchor(s, n) {
    const box = $('.anchor3', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      const lit = +s.dataset.anchor;
      box.innerHTML = AXIS.map((a, i) => `<div class="an ${a.cls}${i === lit ? ' is-on' : ''}">
        <svg class="ic ic-48" viewBox="0 0 24 24"><use href="#${a.icon}"/></svg>
        <b class="an-big">${a.big}</b><span>${a.nm}</span></div>`).join('');
    }
    s.classList.toggle('show-punch', n >= 1);
  },

  // 價值堆疊：逐項浮出並累加總值
  valuestack(s, n) {
    const box = $('#valuestack', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = VALUE.map((v, i) => `<div class="vrow" data-i="${i}">
        <div class="vhd"><b class="h3">${v.t}</b><span class="vsub">$${v.n.toLocaleString()}+</span></div>
        <ul class="vitems">${v.items.map(([t, p]) =>
          `<li><span>${t}</span><b>${p ? '$' + p.toLocaleString() + '+' : '無價'}</b></li>`).join('')}</ul>
      </div>`).join('')
        + `<div class="vtotal"><span>總價值</span><span class="vsum">$0</span></div>`;
    }
    $$('.vrow', box).forEach((r, i) => r.classList.toggle('is-on', i < n));
    const sum = VALUE.slice(0, Math.min(n, 3)).reduce((a, v) => a + v.n, 0);
    const el2 = $('.vsum', box);
    if (n >= 4 && !box.dataset.counted) { box.dataset.counted = 1; countTo(el2, 880000, '$', '+'); }
    else if (n < 4) { box.dataset.counted = ''; el2.textContent = '$' + sum.toLocaleString() + (sum ? '+' : ''); }
    box.classList.toggle('is-total', n >= 4);
    s.classList.toggle('show-punch', n >= 5);
  },

  // 引起動機文字雲：按一次自動分批浮現
  cloud(s, n) {
    const box = $('#cloud', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = CLOUD.map((c, i) =>
        `<span class="cw cw--l${c.lv} cw--a${c.ax}" data-i="${i}">${c.t}</span>`).join('');
    }
    (s._seq || []).forEach(clearTimeout); s._seq = [];
    const items = $$('.cw', box);
    if (n < 1) { items.forEach(x => x.classList.remove('is-on')); s.classList.remove('show-punch'); return; }
    if (REDUCED) { items.forEach(x => x.classList.add('is-on')); s.classList.add('show-punch'); return; }
    items.forEach((x, i) => s._seq.push(setTimeout(() => x.classList.add('is-on'), 90 + i * 130)));
    s._seq.push(setTimeout(() => s.classList.add('show-punch'), 90 + items.length * 130 + 400));
  },

  // 年度時間軸：Salon 每月 ＋ Club 每兩月
  year(s, n) {
    const box = $('#year', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = YEAR.map((y, i) => `<div class="ym" data-i="${i}">
        <div class="ym-m">${y.m}<small>月</small>${y.peak ? '<i class="ym-peak">帶朋友高峰</i>' : ''}</div>
        <div class="ym-s">${y.salon}</div>
        <div class="ym-c${y.club ? ' has' : ''}">${y.club || ''}</div>
        <div class="ym-season">${y.season}</div></div>`).join('');
    }
    $$('.ym', box).forEach((c, i) => setTimeout(() => c.classList.toggle('is-on', n >= 1), n >= 1 ? i * 70 : 0));
    box.classList.toggle('show-club', n >= 2);
    s.classList.toggle('show-punch', n >= 3);
  },

  // Club 六種尊榮體驗
  club6(s, n) {
    const box = $('#club6', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = CLUB6.map((c, i) => `<div class="c6" data-i="${i}">
        <span class="c6-n">${c.n}</span><span class="c6-m">${c.m}</span>
        <div class="h3" style="margin-top:6px">${c.t}</div>
        <div class="c6-d">${c.d}</div>
        <p class="c6-hi">${c.hi}</p></div>`).join('');
    }
    $$('.c6', box).forEach((c, i) => c.classList.toggle('is-on', i < n * 2));
    s.classList.toggle('show-punch', n >= 3);
  },

  // Salon 六大主題：海報 ＋ 情緒目標 ＋ 場地 ＋ 滿足需求
  salon6(s, n) {
    const box = $('#salon6', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = SALON_CAT.map((c, i) => `<figure class="s6" data-i="${i}">
        <img src="assets/img/club/${c.img}.webp" alt="${c.t}">
        <figcaption><b>${c.t}</b><span class="s6-e">${c.e}</span>
          <span class="s6-v">${c.v}</span></figcaption></figure>`).join('');
    }
    $$('.s6', box).forEach((c, i) => setTimeout(() => c.classList.toggle('is-on', n >= 1), n >= 1 ? i * 90 : 0));
    s.classList.toggle('show-punch', n >= 2);
  },

  // Salon 十二場排程
  salon12(s, n) {
    const box = $('#salon12', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = SALON12.map(([m, t, c, r, peak], i) => `<div class="s12" data-i="${i}">
        <span class="s12-m">${m}</span>
        <span class="s12-t">${t}${peak === 2 ? '<i class="s12-peak">帶朋友高峰</i>' : ''}</span>
        <span class="s12-c">${c}</span>
        <span class="s12-r">${r}</span></div>`).join('');
    }
    $$('.s12', box).forEach((c, i) => setTimeout(() => c.classList.toggle('is-on', n >= 1), n >= 1 ? i * 60 : 0));
    s.classList.toggle('show-punch', n >= 2);
  },

  // 兩層導流引擎：面 → 線 → 點 → 循環
  funnel2(s, n) {
    $$('.fl', s).forEach((c, i) => c.classList.toggle('is-on', i < n));
    s.classList.toggle('show-punch', n >= 5);
  },

  // 方案全貌：四種形式與時數
  plan(s, n) {
    const box = $('#plan', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = PLAN.map((p, i) => `<div class="pcard" data-i="${i}">
        <span class="pno">0${i + 1}</span><div class="h3">${p.t}</div>
        <div class="phrs">${p.h}</div><p class="small">${p.d}</p></div>`).join('');
    }
    $$('.pcard', box).forEach((c, i) => c.classList.toggle('is-on', i < n));
    s.classList.toggle('show-punch', n >= 5);
  },

  // 誰教您什麼：四位講師 × 四種形式
  planby(s, n) {
    const box = $('#planby', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = `<div class="pb-col pb-col--head"><div class="pb-hd"></div>${
        PLAN.map(p => `<div class="pb-row"><b>${p.t}</b><span>${p.h}</span></div>`).join('')}</div>`
        + PLAN_BY.map((f2, i) => `<div class="pb-col" data-i="${i}">
          <div class="pb-hd"><div class="halo"><img class="avatar-sm" src="assets/img/speakers/${f2.img}-avatar.webp" alt="${f2.nm}"></div>
            <b>${f2.nm}</b><span>${f2.role}</span></div>
          ${f2.rows.map(r => `<div class="pb-row">${r}</div>`).join('')}</div>`).join('');
    }
    $$('.pb-col[data-i]', box).forEach((c, i) => c.classList.toggle('is-on', i < n));
    s.classList.toggle('show-punch', n >= 5);
  },

  // 本場優惠倒數：講者按一次才開始跑，避免掛在頁面上空轉
  countdown(s, n) {
    const total = +s.dataset.countdown || 900;
    const t = $('#cdT', s), ring = $('.cd-fg', s), box = $('#cd', s);
    if (!ring.dataset.len) {
      const L = 2 * Math.PI * 52;
      ring.dataset.len = L; ring.style.strokeDasharray = L; ring.style.strokeDashoffset = 0;
    }
    const paint = left => {
      const m = Math.floor(left / 60), sec = left % 60;
      t.textContent = `${m}:${String(sec).padStart(2, '0')}`;
      ring.style.strokeDashoffset = (+ring.dataset.len) * (1 - left / total);
      box.classList.toggle('is-low', left <= 120);
      box.classList.toggle('is-done', left <= 0);
    };
    clearInterval(box._t);
    const remain = () => Math.max(0, Math.round((box._deadline - Date.now()) / 1000));
    if (n < 1 && !box._deadline) { paint(total); box.classList.remove('is-run', 'is-low', 'is-done'); return; }
    if (!box._deadline) box._deadline = Date.now() + total * 1000;   // 第一次按下才開始計時
    box.classList.add('is-run');
    paint(remain());
    box._t = setInterval(() => { const r = remain(); paint(r); if (r <= 0) clearInterval(box._t); }, 1000);
  },

  // 正式對外方案：菁英 vs 尊榮
  tiers(s, n) {
    const box = $('#tiers', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = TIERS.map((t, i) => `<div class="tier${t.full ? ' tier--full' : ''}" data-i="${i}">
        ${t.full ? '<span class="tier-crown">完整版</span>' : ''}
        <div class="tier-k">${t.k}</div>
        <div class="tier-nm">${t.nm}<b>${t.hrs}</b></div>
        <ul class="tier-items">${t.items.map(([a, b]) =>
          `<li><span>${a}</span><b>${b}</b></li>`).join('')}</ul>
        <div class="tier-n">$${t.n.toLocaleString()}</div>
        <div class="tier-lb">終生會員價</div></div>`).join('');
    }
    $$('.tier', box).forEach((c, i) => c.classList.toggle('is-on', i < n));
    s.classList.toggle('show-punch', n >= 3);
  },

  // 價格揭曉：定價 → 特惠 → 創始夥伴（前兩層逐級劃掉）
  price(s, n) {
    const box = $('#price', s);
    if (!box.dataset.built) {
      box.dataset.built = 1;
      box.innerHTML = PRICE.map((p, i) => `<div class="prow${p.cut ? ' cutable' : ' final'}" data-i="${i}">
        <span class="plb">${p.lb}</span><span class="pn">$${p.n.toLocaleString()}</span></div>`).join('');
    }
    $$('.prow', box).forEach((r, i) => {
      r.classList.toggle('is-on', i < n);
      r.classList.toggle('is-cut', PRICE[i].cut && n > i + 1);
    });
    s.classList.toggle('show-punch', n >= 4);
  },

  // 影片頁：一律內嵌播放。按 → 直接翻頁不佔步數，只有「點擊」才載入播放
  video() { /* 步進不做事，避免講者被卡在影片頁 */ }

};


function countTo(node, target, pre = '', post = '') {
  const dur = 900, t0 = performance.now();
  const tick = t => {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    const v = Math.round(target * e);
    node.textContent = pre + (pre ? v.toLocaleString() : v) + (p >= 1 ? post : '');
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ══════════ 8. 自訂圖形 ══════════ */

function axisLoopSVG() {
  const P = [[300, 90], [478, 400], [122, 400]];
  const arc = (a, b) => {
    const [x1, y1] = P[a], [x2, y2] = P[b];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const cx = 300 + (mx - 300) * 1.5, cy = 300 + (my - 300) * 1.5;
    return `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`;
  };
  return `<svg viewBox="0 0 600 500" class="al">
    <path id="al-a0" class="al-arc" d="${arc(0, 1)}"/>
    <path id="al-a1" class="al-arc" d="${arc(1, 2)}"/>
    <path id="al-a2" class="al-arc" d="${arc(2, 0)}"/>
    <path id="al-h0" class="al-arrow" d="M0 -9 L13 0 L0 9 Z" transform="translate(452,262) rotate(70)"/>
    <path id="al-h1" class="al-arrow" d="M0 -9 L13 0 L0 9 Z" transform="translate(300,462) rotate(180)"/>
    <path id="al-h2" class="al-arrow" d="M0 -9 L13 0 L0 9 Z" transform="translate(148,262) rotate(-70)"/>
    ${AXIS.map((a, i) => `<g id="al-n${i}" class="al-node ${a.cls}" transform="translate(${P[i][0]},${P[i][1]})">
        <circle r="62" class="al-bg"/><circle r="62" class="al-ring"/>
        <svg x="-24" y="-46" width="48" height="48" viewBox="0 0 24 24" class="ic"><use href="#${a.icon}"/></svg>
        <text y="22" class="al-big">${a.big}</text>
        <text y="46" class="al-nm">${a.nm}</text>
      </g>`).join('')}
    <g id="al-core" class="al-core" transform="translate(300,300)">
      <circle r="46" class="al-corebg"/>
      <svg x="-26" y="-26" width="52" height="52" viewBox="0 0 24 24" class="ic"><use href="#i01"/></svg>
    </g>
  </svg>`;
}

function drawFailChart(svg) {
  svg.innerHTML = '';
  const W = 900, H = 300, pad = 40;
  el('line', { x1:pad, y1:H - pad, x2:W - pad, y2:H - pad, stroke:'var(--line-hair)', 'stroke-width':1.5 }, svg);
  el('line', { x1:pad, y1:20, x2:pad, y2:H - pad, stroke:'var(--line-hair)', 'stroke-width':1.5 }, svg);
  const rev  = `M${pad} 150 C 300 130, 500 145, ${W - pad} 165`;
  const cost = `M${pad} 240 C 300 225, 520 130, ${W - pad} 40`;
  const p1 = el('path', { d:rev, fill:'none', stroke:'var(--paper-46)', 'stroke-width':2.4, class:'fc-line' }, svg);
  const p2 = el('path', { d:cost, fill:'none', stroke:'var(--clay)', 'stroke-width':2.4, class:'fc-line' }, svg);
  [p1, p2].forEach(p => { const L = p.getTotalLength();
    p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  el('text', { x:W - pad, y:180, class:'fc-lb', 'text-anchor':'end' }, svg).textContent = '營收';
  el('text', { x:W - pad, y:32,  class:'fc-lb fc-lb--clay', 'text-anchor':'end' }, svg).textContent = '廣告成本';
  // 實際求兩條曲線的交點，避免手寫座標對不準
  const at = (p, x) => { let lo = 0, hi = p.getTotalLength();
    for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2;
      if (p.getPointAtLength(m).x < x) lo = m; else hi = m; }
    return p.getPointAtLength((lo + hi) / 2).y; };
  let cx = pad, best = Infinity;
  for (let x = pad; x <= W - pad; x += 4) {
    const d = Math.abs(at(p1, x) - at(p2, x));
    if (d < best) { best = d; cx = x; }
  }
  const cy = at(p1, cx);
  el('circle', { cx, cy, r:14, fill:'none', stroke:'var(--clay)', 'stroke-width':1.6, class:'fc-cross' }, svg);
  el('text', { x:cx, y:cy - 24, class:'fc-lb fc-lb--clay', 'text-anchor':'middle', 'data-cross':1 }, svg).textContent = '收支交叉';
}

function drawRotary(svg) {
  svg.innerHTML = '';
  el('circle', { cx:200, cy:200, r:78, fill:'none', stroke:'var(--line-soft)', 'stroke-width':1.6 }, svg);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const x = 200 + Math.cos(a) * 128, y = 200 + Math.sin(a) * 128;
    // 定位用外層 g（transform 屬性），CSS transform 只作用在內層，兩者才不會互相覆蓋
    const outer = el('g', { transform:`translate(${x},${y})` }, svg);
    const g = el('g', { class:'rperson' + (i === 7 ? ' is-out' : '') }, outer);
    el('circle', { r:15, fill:'none', stroke:'var(--gold-500)', 'stroke-width':1.6 }, g);
    el('path', { d:'M-16 26c0-10 7-16 16-16s16 6 16 16', fill:'none',
      stroke:'var(--gold-500)', 'stroke-width':1.6, 'stroke-linecap':'round' }, g);
  }
  el('circle', { cx:200, cy:200, r:106, fill:'none', stroke:'var(--gold-500)',
    'stroke-width':1.2, 'stroke-dasharray':'4 6', class:'rsplit' }, svg);
}

function drawESBI(svg) {
  svg.innerHTML = '';
  const cells = [['E','員工',0,0],['B','企業家',1,0],['S','自雇者',0,1],['I','投資者',1,1]];
  cells.forEach(([k, nm, cx, cy]) => {
    const x = 20 + cx * 190, y = 20 + cy * 190;
    const g = el('g', { class:'q q-' + k }, svg);
    el('rect', { x, y, width:180, height:180, rx:12, fill:'none',
      stroke:'var(--line-soft)', 'stroke-width':1.4, class:'qbox' }, g);
    const t1 = el('text', { x:x + 90, y:y + 84, class:'qk', 'text-anchor':'middle' }, g); t1.textContent = k;
    const t2 = el('text', { x:x + 90, y:y + 120, class:'qn', 'text-anchor':'middle' }, g); t2.textContent = nm;
  });
  el('path', { d:'M110 110 L300 300', class:'qpath', fill:'none',
    stroke:'var(--gold-500)', 'stroke-width':2.6, 'stroke-linecap':'round' }, svg);
  el('path', { d:'M288 288l14 14-19 3z', class:'qpath', fill:'var(--gold-500)' }, svg);
}

function puzzleSVG() {
  const pieces = [
    { d:'M0 0h96v34a14 14 0 010 28V96H62a14 14 0 00-28 0H0z', t:'軟體研發<br>交易系統', from:'-320px,-140px' },
    { d:'M0 0h34a14 14 0 0028 0h34v96H62a14 14 0 01-28 0H0z',  t:'政府補助<br>銀行槓桿', from:'320px,-120px' },
    { d:'M0 0h96v96H62a14 14 0 01-28 0H0V62a14 14 0 000-28z',  t:'企業營運<br>資金調度', from:'0,300px' }
  ];
  return `<div class="pzwrap">${pieces.map((p, i) =>
    `<div class="pz" id="pz${i}" style="--from:${p.from}">
      <svg viewBox="-4 -4 104 104" width="150" height="150"><path d="${p.d}"/></svg>
      <span>${p.t}</span></div>`).join('')}
    <div class="pz-core"><svg viewBox="0 0 24 24" class="ic ic-96"><use href="#i01"/></svg></div></div>`;
}

function drawSeats(svg) {
  svg.innerHTML = '';
  el('circle', { cx:200, cy:200, r:86, fill:'none', stroke:'var(--line-soft)', 'stroke-width':1.6 }, svg);
  const g0 = el('g', {}, svg);
  el('circle', { cx:200, cy:200, r:34, fill:'none', stroke:'var(--line-hair)', 'stroke-width':1.2 }, g0);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    el('circle', { cx:200 + Math.cos(a) * 132, cy:200 + Math.sin(a) * 132, r:17,
      fill:'none', stroke:'var(--gold-500)', 'stroke-width':1.8, class:'seat' }, svg);
  }
  const cl = el('g', { transform:'translate(200,200) scale(.62) translate(-50,-50)' }, svg);
  const s2 = el('svg', { viewBox:'0 0 100 100', width:100, height:100 }, cl);
  drawClock(s2, FRAG_TOTAL, true);
}

/* ══════════ 9. 總覽模式 ══════════ */

function buildOverview() {
  const g = $('#ovGrid');
  const titleOf = s => {
    // 依序找：主標 → 案例公司名 → 眉標 → 金句，讓總覽每一格都看得出是哪一頁
    const h = s.querySelector('.d1,.d2,.h1');
    if (h) return h.textContent;
    const co = s.querySelector('.case-plate figcaption b');
    if (co) return '案例　' + co.textContent;
    const k = s.querySelector('.kicker');
    if (k) return k.textContent;
    const q = s.querySelector('.quote');
    if (q) return q.textContent;
    return '（過場）';
  };
  g.innerHTML = slides.map((s, i) => {
    const t = titleOf(s).replace(/\s+/g, ' ').trim().slice(0, 20);
    const ch = +s.dataset.chap || 1;
    return `<button class="ov-cell" data-go="${i}"><span class="ov-n">${String(i + 1).padStart(2, '0')}</span>
      <span class="ov-t">${t}</span><span class="ov-c ovc${ch}">${CHAPTERS[ch - 1]}</span></button>`;
  }).join('');
  g.onclick = e => { const b = e.target.closest('[data-go]'); if (!b) return;
    toggleOverview(false); show(+b.dataset.go); };
}
function toggleOverview(on) {
  const o = $('#overview');
  o.classList.toggle('is-open', on === undefined ? !o.classList.contains('is-open') : on);
}

/* ══════════ 10. 事件 ══════════ */

addEventListener('keydown', e => {
  if (e.key === 'Escape') { toggleOverview(false); if (blackedOut) toggleBlack(); return; }
  if ($('#overview').classList.contains('is-open')) return;
  switch (e.key) {
    case 'ArrowRight': case ' ': case 'PageDown': e.preventDefault(); next(); break;
    case 'ArrowLeft':  case 'PageUp':            e.preventDefault(); prev(); break;
    case 'ArrowDown':  e.preventDefault(); show(Math.min(cur + 1, slides.length - 1)); break;
    case 'ArrowUp':    e.preventDefault(); show(Math.max(cur - 1, 0)); break;
    case 'o': case 'O': toggleOverview(); break;
    case 'b': case 'B': toggleBlack(); break;
    case 'f': case 'F': toggleFull(); break;
    case 'r': case 'R': step = 0; applyStep(slides[cur], 0); break;
    default:
      if (/^[1-8]$/.test(e.key)) {
        const i = slides.findIndex(s => +s.dataset.chap === +e.key);
        if (i >= 0) show(i);
      }
  }
});

function toggleBlack() { blackedOut = !blackedOut; $('#blackout').classList.toggle('is-on', blackedOut); }
function toggleFull() { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }

$('#pbar').onclick = e => {
  const b = e.target.closest('[data-nav]'); if (!b) return;
  ({ prev, next, overview: () => toggleOverview(), full: toggleFull })[b.dataset.nav]();
};

let hideT;
addEventListener('mousemove', () => {
  $('#pbar').classList.add('is-visible');
  clearTimeout(hideT); hideT = setTimeout(() => $('#pbar').classList.remove('is-visible'), 2000);
});

// 金色漣漪
addEventListener('click', e => {
  const btn = e.target.closest('.btn'); if (!btn || btn.disabled) return;
  const r = btn.getBoundingClientRect();
  const sc = +getComputedStyle(stage).getPropertyValue('--scale') || 1;
  const n = document.createElement('span');
  n.className = 'ripple';
  n.style.left = (e.clientX - r.left) / sc + 'px';
  n.style.top  = (e.clientY - r.top)  / sc + 'px';
  n.style.transform = 'translate(-50%,-50%)';
  btn.appendChild(n); setTimeout(() => n.remove(), 460);
});

// 舞台點擊也可推進（避開按鈕與互動元件）
stage.addEventListener('click', e => {
  // 互動元件自己處理點擊，不可再觸發翻頁
  if (e.target.closest('.btn, .myth, .qcard, iframe, .videobox, .vtabs, .vtab, a')) return;
  next();
});
/* ── 影片：點擊才播，切分頁才換 ── */
function playVideo(slide, i = 0) {
  const box = $('.videobox', slide); if (!box) return;
  const ids = (slide.dataset.video || '').split(',').filter(Boolean);
  const starts = (slide.dataset.vstart || '').split(',');
  const id = ids[i]; if (!id) return;
  const st = +starts[i] || 0;
  if (!box.dataset.ph) box.dataset.ph = box.innerHTML;
  $$('.vtab', slide).forEach((t, k) => t.classList.toggle('is-on', k === i));
  if (box.dataset.loaded === id) return;
  box.dataset.loaded = id;
  box.innerHTML =
    `<iframe src="https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1${st ? '&start=' + st : ''}"
       title="25HRS" frameborder="0"
       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
       referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
     <a class="vopen" href="https://www.youtube.com/watch?v=${id}${st ? '&t=' + st : ''}" target="_blank" rel="noopener">在 YouTube 開啟</a>`;
}
function stopVideo(slide) {
  const box = $('.videobox', slide);
  if (box && box.dataset.loaded) { box.innerHTML = box.dataset.ph || ''; box.dataset.loaded = ''; }
}
document.addEventListener('click', e => {
  const tab = e.target.closest('.vtab');
  if (tab) { const s = tab.closest('.slide');
    playVideo(s, $$('.vtab', s).indexOf(tab)); return; }
  const box = e.target.closest('.videobox');
  if (box) playVideo(box.closest('.slide'), Math.max(0, $$('.vtab', box.closest('.slide')).findIndex(t => t.classList.contains('is-on'))));
});

/* ══════════ 11. 啟動 ══════════ */

buildCases();
buildMatrix();
slides = $$('.slide');
$('#dots').innerHTML = CHAPTERS.map(() => '<span class="dot"></span>').join('');
drawClock($('#clock'), 0);
if ($('#qaClock')) drawClock($('#qaClock'), FRAG_TOTAL, true);
buildOverview();
// 深連結：?s=12&step=4　用於彩排定位與截圖驗收
const QS = new URLSearchParams(location.search);
const jump = Math.min(Math.max((+QS.get('s') || 1) - 1, 0), slides.length - 1);
cur = jump;
slides[cur].classList.add('is-active');
step = QS.has('step') ? Math.min(+QS.get('step'), maxStep(slides[cur])) : 0;
applyStep(slides[cur], step);
if (step >= maxStep(slides[cur])) {
  // 截圖模式：補上需要動畫才會累加的碎片，讓進度圈呈現正確狀態
  const upto = slides.slice(0, cur + 1).filter(s => s.dataset.poll !== undefined
    || s.dataset.matrix !== undefined || s.dataset.rotary !== undefined
    || s.dataset.puzzle !== undefined || s.dataset.mirrors !== undefined
    || s.dataset.fade10 !== undefined || s.dataset.ladder !== undefined
    || (s.dataset.axisloop !== undefined && !s.dataset.final)).length;
  fragments = Math.min(upto, FRAG_TOTAL); drawClock($('#clock'), fragments);
}
updateChrome();
if (AUTO_PAGES.has(cur + 1) && !QS.has('step')) autoPlay(slides[cur]);

window.__applyStep = applyStep; window.__maxStep = maxStep;   // 版面稽核用
console.log(`%c25HRS Deck　${slides.length} 頁　│　→ 下一步　← 上一步　O 總覽　B 黑幕　F 全螢幕　R 重置`,
  'color:#d6b16a;font-size:13px');
})();
