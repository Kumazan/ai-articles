'use client'

interface Props {
  onClose: () => void
}

const shortcuts = [
  ['←/→', '切換欄位'],
  ['↑/↓', '在卡片間移動'],
  ['Tab', '下一個欄位'],
  ['Enter', '編輯選取的卡片'],
  ['N', '在目前欄位新增卡片'],
  ['M', '移動卡片到其他欄位'],
  ['D', '刪除卡片（需確認）'],
  ['1-4', '快速設定優先度 P0-P3'],
  ['Esc', '關閉視窗 / 取消選取'],
  ['?', '顯示快捷鍵說明'],
]

export function KeyboardHelp({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-overlay" />
      <div className="relative bg-surface rounded-2xl border border-border shadow-2xl p-6 max-w-sm w-full mx-4 animate-modal-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">⌨️ 鍵盤快捷鍵</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text text-xl leading-none p-1">×</button>
        </div>
        <div className="space-y-2">
          {shortcuts.map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between">
              <kbd className="text-xs font-mono bg-surface-alt border border-border rounded px-2 py-1 min-w-[3rem] text-center">{key}</kbd>
              <span className="text-sm text-text-secondary">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
