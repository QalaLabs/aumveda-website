'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Slider } from '@/components/ui/slider'
import {
  Send,
  Loader2,
  X,
  ImagePlus,
  CloudOff,
  Trash2,
  Mic,
  Square,
  Sparkles,
  Bold,
  Italic,
  List,
  Eye,
  EyeOff,
  Volume2,
} from 'lucide-react'
import { showSuccess, showError } from '@/utils/toast'

interface Props {
  initialData?: {
    id: number
    title: string | null
    body: string | null
    mood: number | null
    tags: string[]
    voiceNoteUrl?: string | null
    aiReflection?: string | null
    practitionerVisible?: boolean
  }
}

export default function JournalEditor({ initialData }: Props) {
  const router = useRouter()
  const isEdit = !!initialData

  const [title, setTitle] = useState(initialData?.title ?? '')
  const [body, setBody] = useState(initialData?.body ?? '')
  const [mood, setMood] = useState([initialData?.mood ? initialData.mood * 2 : 7])
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
  const [images, setImages] = useState<string[]>([])
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(initialData?.voiceNoteUrl ?? null)
  const [aiReflection, setAiReflection] = useState<string | null>(initialData?.aiReflection ?? null)
  const [practitionerVisible, setPractitionerVisible] = useState(initialData?.practitionerVisible ?? true)
  
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [reflecting, setReflecting] = useState(false)
  const [error, setError] = useState('')
  const [hasDraft, setHasDraft] = useState(false)
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Voice Note Recording State
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Restore offline draft
  useEffect(() => {
    if (!isEdit) {
      const saved = localStorage.getItem('journal_draft')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.body) {
          setTitle(parsed.title ?? '')
          setBody(parsed.body)
          setMood([parsed.mood ?? 7])
          setTags(parsed.tags ?? [])
          setVoiceNoteUrl(parsed.voiceNoteUrl ?? null)
          setAiReflection(parsed.aiReflection ?? null)
          setPractitionerVisible(parsed.practitionerVisible ?? true)
          setHasDraft(true)
        }
      }
    }
  }, [isEdit])

  // Save offline draft
  useEffect(() => {
    if (isEdit) return
    const t = setInterval(() => {
      if (body) {
        localStorage.setItem(
          'journal_draft',
          JSON.stringify({ title, body, mood: mood[0], tags, voiceNoteUrl, aiReflection, practitionerVisible })
        )
      }
    }, 5000)
    return () => clearInterval(t)
  }, [title, body, mood, tags, voiceNoteUrl, aiReflection, practitionerVisible, isEdit])

  // Markdown Formatting Helper
  function formatText(syntax: 'bold' | 'italic' | 'list') {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selected = text.substring(start, end)

    let replacement = ''
    if (syntax === 'bold') {
      replacement = `**${selected || 'bold text'}**`
    } else if (syntax === 'italic') {
      replacement = `*${selected || 'italic text'}*`
    } else if (syntax === 'list') {
      replacement = `\n- ${selected || 'item'}`
    }

    const newBody = text.substring(0, start) + replacement + text.substring(end)
    setBody(newBody)

    // Reset cursor focus
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + replacement.length, start + replacement.length)
    }, 50)
  }

  // Voice Note Recorder Controls
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' })
        const file = new File([audioBlob], 'voicerecording.mp3', { type: 'audio/mp3' })
        
        // Upload voice note file
        const formData = new FormData()
        formData.append('file', file)
        
        try {
          const res = await fetch('/api/journals/upload', {
            method: 'POST',
            body: formData,
          })
          if (!res.ok) throw new Error('Upload failed')
          const data = await res.json()
          setVoiceNoteUrl(data.url)
          showSuccess('Voice note recorded and attached.')
        } catch (err) {
          showError('Failed to upload voice note.')
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingSeconds(0)
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      showError('Microphone access denied or unavailable.')
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  // Image Attachments
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await fetch('/api/journals/upload', {
          method: 'POST',
          body: formData,
        })
        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        setImages((prev) => [...prev, data.url])
      } catch (err) {
        showError(`Failed to upload ${file.name}`)
      }
    }
  }

  // AI somatic reflection trigger
  async function triggerAiReflection() {
    if (!body.trim()) {
      setError('Please write some content before requesting AI analysis.')
      return
    }
    setError('')
    setReflecting(true)
    try {
      const res = await fetch('/api/journals/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, journalId: initialData?.id }),
      })
      if (!res.ok) throw new Error('AI service offline')
      const data = await res.json()
      setAiReflection(data.reflection)
      showSuccess('AI Somatic Analysis generated successfully!')
    } catch (err) {
      showError('Somatic analysis service failed. Please try again.')
    } finally {
      setReflecting(false)
    }
  }

  // Save changes
  async function handleSave() {
    if (!body.trim()) {
      setError('Write something before saving.')
      return
    }
    setError('')

    setLoading(true)
    const url = isEdit ? `/api/journals/${initialData!.id}` : '/api/journals'
    const method = isEdit ? 'PATCH' : 'POST'
    const moodDb = Math.max(1, Math.min(5, Math.round(mood[0] / 2)))

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || null,
          body,
          mood: moodDb,
          tags,
          voiceNoteUrl,
          aiReflection,
          practitionerVisible,
        }),
      })

      setLoading(false)
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Failed to save.')
        return
      }

      const data = await res.json()
      localStorage.removeItem('journal_draft')
      router.push(`/dashboard/journal/${data.data.id}`)
      router.refresh()
    } catch (err) {
      setLoading(false)
      setError('Failed to save connection.')
    }
  }

  async function handleDelete() {
    if (!isEdit) return
    setDeleting(true)
    await fetch(`/api/journals/${initialData!.id}`, { method: 'DELETE' })
    router.push('/dashboard/journal')
    router.refresh()
  }

  const toolBtn =
    'inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))] hover:bg-[hsl(var(--av-stone)/0.5)] transition-colors duration-[var(--duration-micro)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]'

  return (
    <div className="space-y-8">
      {error && (
        <p
          role="alert"
          className="font-body text-sm text-[hsl(var(--av-rose))] border border-[hsl(var(--av-rose)/0.35)] rounded-2xl px-4 py-3 bg-[hsl(var(--av-parchment))]"
        >
          {error}
        </p>
      )}

      {hasDraft && !isEdit && (
        <div className="flex items-center gap-2 font-body text-sm text-[hsl(var(--av-ink-text))] border border-[hsl(var(--av-stone))] rounded-2xl px-4 py-3 bg-[hsl(var(--av-parchment))]">
          <CloudOff className="w-4 h-4 text-[hsl(var(--av-mute))] flex-shrink-0" strokeWidth={1.5} />
          Offline draft restored
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('journal_draft')
              setBody('')
              setTitle('')
              setVoiceNoteUrl(null)
              setAiReflection(null)
              setHasDraft(false)
            }}
            className="ml-auto font-body text-sm text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-night))] underline underline-offset-4 min-h-[44px] px-2"
          >
            Discard
          </button>
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 pb-3 border-b border-[hsl(var(--av-stone))]">
        <button type="button" onClick={() => formatText('bold')} className={toolBtn} title="Bold text" aria-label="Bold">
          <Bold className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button type="button" onClick={() => formatText('italic')} className={toolBtn} title="Italic text" aria-label="Italic">
          <Italic className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button type="button" onClick={() => formatText('list')} className={toolBtn} title="Bullet list" aria-label="List">
          <List className="w-4 h-4" strokeWidth={1.5} />
        </button>

        <span className="w-px h-5 bg-[hsl(var(--av-stone))] mx-2" aria-hidden />

        {isRecording ? (
          <div className="inline-flex items-center gap-2 font-body text-sm text-[hsl(var(--av-rose))] px-3 h-11">
            <span className="w-2 h-2 bg-[hsl(var(--av-rose))] rounded-full" aria-hidden />
            <span className="tabular">Recording {recordingSeconds}s</span>
            <button
              type="button"
              onClick={stopRecording}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[hsl(var(--av-rose))] hover:bg-[hsl(var(--av-stone)/0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
              aria-label="Stop recording"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="inline-flex h-11 min-h-[44px] items-center gap-2 font-body text-sm text-[hsl(var(--av-night))] px-3 rounded-lg hover:bg-[hsl(var(--av-stone)/0.5)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
            title="Record voice note"
          >
            <Mic className="w-4 h-4" strokeWidth={1.5} /> Record audio
          </button>
        )}
      </div>

      {voiceNoteUrl && (
        <div className="border border-[hsl(var(--av-stone))] rounded-2xl px-4 py-3 flex items-center justify-between bg-[hsl(var(--av-parchment))]">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-[hsl(var(--av-gold))]" strokeWidth={1.5} />
            <span className="font-body text-sm text-[hsl(var(--av-ink-text))]">Voice note attached</span>
          </div>
          <button
            type="button"
            onClick={() => setVoiceNoteUrl(null)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-rose))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
            aria-label="Remove voice note"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      )}

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="A title, if one arrives…"
        aria-label="Entry title"
        className="w-full font-serif text-3xl md:text-4xl text-[hsl(var(--av-night))] bg-transparent border-none outline-none placeholder:text-[hsl(var(--av-mute)/0.45)] focus-visible:outline-none leading-tight"
      />

      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What is present for you today…"
        rows={14}
        aria-label="Journal entry body"
        className="w-full font-body text-lg text-[hsl(var(--av-ink-text))] leading-[1.85] bg-transparent border-none outline-none resize-none placeholder:text-[hsl(var(--av-mute)/0.45)] max-w-[65ch] focus-visible:outline-none min-h-[280px]"
      />

      {aiReflection && (
        <aside className="rounded-2xl border border-[hsl(var(--av-gold)/0.35)] bg-[hsl(var(--av-night)/0.04)] p-5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold))] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} /> Somatic insight
            </p>
            <button
              type="button"
              onClick={() => setAiReflection(null)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-rose))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
              aria-label="Dismiss insight"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
          <p className="font-serif text-sm italic leading-relaxed text-[hsl(var(--av-ink-text))] whitespace-pre-line max-w-[65ch]">
            {aiReflection}
          </p>
        </aside>
      )}

      <div className="space-y-3 pt-2 border-t border-[hsl(var(--av-stone))]">
        <div className="flex justify-between items-center">
          <p className="font-body text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--av-mute))]">
            How the body feels
          </p>
          <span className="font-body text-sm text-[hsl(var(--av-mute))] tabular">
            {mood[0] <= 3 ? 'Heavy' : mood[0] <= 5 ? 'Tender' : mood[0] <= 7 ? 'Steady' : 'Light'}
          </span>
        </div>
        <Slider value={mood} onValueChange={setMood} min={1} max={10} step={1} className="py-2" />
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 font-body text-xs text-[hsl(var(--av-ink-text))] border border-[hsl(var(--av-stone))] rounded-full px-3 py-1.5"
            >
              #{tag}
              <button
                type="button"
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                className="text-[hsl(var(--av-mute))] hover:text-[hsl(var(--av-rose))] min-w-[20px]"
                aria-label={`Remove tag ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {tags.length < 5 && (
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
                if (t && !tags.includes(t)) setTags([...tags, t])
                setTagInput('')
              }
            }}
            placeholder="Add tag…"
            aria-label="Add tag"
            className="h-11 min-h-[44px] font-body text-sm border border-[hsl(var(--av-stone))] rounded-2xl px-4 w-36 bg-[hsl(var(--av-parchment))] text-[hsl(var(--av-ink-text))] placeholder:text-[hsl(var(--av-mute))] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
          />
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-[hsl(var(--av-stone))]">
              <img src={url} alt={`Attachment ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                className="absolute top-2 right-2 h-11 w-11 min-h-[44px] bg-[hsl(var(--av-parchment)/0.95)] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
                aria-label={`Remove image ${i + 1}`}
              >
                <X className="w-4 h-4 text-[hsl(var(--av-night))]" strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 py-2 border-t border-[hsl(var(--av-stone))] select-none">
        <label className="inline-flex items-center gap-3 cursor-pointer font-body text-sm text-[hsl(var(--av-mute))] min-h-[44px]">
          <input
            type="checkbox"
            checked={practitionerVisible}
            onChange={(e) => setPractitionerVisible(e.target.checked)}
            className="rounded border-[hsl(var(--av-stone))] text-[hsl(var(--av-night))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))] w-5 h-5"
          />
          {practitionerVisible ? (
            <span className="flex items-center gap-1.5 text-[hsl(var(--av-sage))]">
              <Eye className="w-4 h-4" strokeWidth={1.5} /> Visible to healers (Archana / Sejal)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[hsl(var(--av-mute))]">
              <EyeOff className="w-4 h-4" strokeWidth={1.5} /> Private to myself only
            </span>
          )}
        </label>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-[hsl(var(--av-stone))]">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={toolBtn}
            title="Attach images"
            aria-label="Attach images"
          >
            <ImagePlus className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={triggerAiReflection}
            disabled={reflecting}
            className="inline-flex h-11 min-h-[44px] items-center gap-2 font-body text-sm text-[hsl(var(--av-night))] border border-[hsl(var(--av-stone))] hover:border-[hsl(var(--av-gold))] px-4 rounded-full transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-gold))]"
          >
            {reflecting ? (
              <Loader2 className="w-4 h-4 animate-spin text-[hsl(var(--av-gold))]" strokeWidth={1.5} />
            ) : (
              <Sparkles className="w-4 h-4 text-[hsl(var(--av-gold))]" strokeWidth={1.5} />
            )}
            Analyze tension
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex h-11 min-h-[44px] items-center gap-1.5 font-body text-sm text-[hsl(var(--av-rose))] hover:underline underline-offset-4 disabled:opacity-50 px-2"
            >
              <Trash2 className="w-4 h-4" strokeWidth={1.5} />
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="inline-flex h-12 min-h-[44px] items-center gap-2 font-body text-sm font-medium bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] hover:bg-[hsl(var(--av-gold-soft))] px-7 rounded-full transition-transform duration-[var(--duration-micro)] active:scale-[0.97] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--av-night))]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Send className="w-4 h-4" strokeWidth={1.5} />
            )}
            {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Save entry'}
          </button>
        </div>
      </div>
    </div>
  )
}
