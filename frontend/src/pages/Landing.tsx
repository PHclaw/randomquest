import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex flex-col items-center justify-center text-white p-4">
      <div className="text-6xl mb-4">馃幉</div>
      <h1 className="text-4xl font-bold mb-2">RandomQuest</h1>
      <p className="text-xl opacity-90 mb-8">姣忓ぉ涓€涓殢鏈烘寫鎴橈紝璁╃敓娲讳笉鍐嶆棤鑱?/p>
      
      <div className="space-y-3 text-center mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">馃幆</span>
          <span>姣忔棩闅忔満鎸戞垬锛堢編椋?绀句氦/鍋ュ悍/鍒涙剰/瀛︿範锛?/span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">馃摳</span>
          <span>鎵撳崱鍒嗕韩锛岃褰曚綘鐨勭簿褰╃灛闂?/span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">馃弳</span>
          <span>杩炵画鎵撳崱瑙ｉ攣鎴愬氨寰界珷</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">馃懃</span>
          <span>鐪嬬湅鍒汉閮藉湪鍋氫粈涔堟寫鎴?/span>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Link to="/login" className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100">
          鐧诲綍
        </Link>
        <Link to="/register" className="px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800">
          娉ㄥ唽
        </Link>
      </div>
    </div>
  )
}
