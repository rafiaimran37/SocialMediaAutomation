import { CalendarDays, ImagePlus, MessageSquareText, MonitorSmartphone, Send, ShieldCheck, Sparkles, UploadCloud, X } from 'lucide-react'

export const addScheduleData = {
  platformOptions: [
    {
      id: 'facebook',
      label: 'Facebook',
      icon: MonitorSmartphone,
      accent: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: ImagePlus,
      accent: 'bg-pink-50 text-pink-700',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: MessageSquareText,
      accent: 'bg-sky-50 text-sky-700',
    },
    {
      id: 'twitter-x',
      label: 'Twitter / X',
      icon: X,
      accent: 'bg-slate-100 text-slate-700',
    },
  ],
  previewMetrics: [
    { id: 'reach', label: 'Reach', value: '18.4K' },
    { id: 'engagement', label: 'Engagement', value: '6.2%' },
    { id: 'best-time', label: 'Best Time', value: '09:00 AM' },
  ],
  attachmentHints: [
    { id: 'png', label: 'PNG' },
    { id: 'jpg', label: 'JPG' },
    { id: 'mp4', label: 'MP4' },
    { id: 'gif', label: 'GIF' },
  ],
  previewPost: {
    id: 'preview-post',
    accountName: 'Acme Corp',
    scheduleLabel: 'Scheduled for Oct 24 • 9:00 AM',
    headline: 'Launch week content preview',
    imageAlt: 'Office workspace preview',
  },
  reminders: [
    { id: 'approval', title: 'Approval Required', description: 'Notify manager for content review before publishing', icon: ShieldCheck },
    { id: 'auto-enhance', title: 'Auto Optimize', description: 'Suggest stronger caption variants using AI', icon: Sparkles },
    { id: 'upload', title: 'Media Ready', description: 'Upload files now or attach them later from the queue', icon: UploadCloud },
  ],
}