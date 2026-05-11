export type UserRole = "user" | "admin" | "moderator";
export type SubscriptionTier = "free" | "creator" | "pro" | "studio";
export type SubscriptionStatus = "active" | "inactive" | "trialing" | "past_due" | "canceled";
export type JobStatus = "queued" | "processing" | "completed" | "failed";
export type MediaType = "image" | "video";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  subscription_tier: SubscriptionTier;
  subscription_status: SubscriptionStatus;
  storage_used: number;
  storage_limit: number;
  credits_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  type: MediaType;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
}

export interface Upload {
  id: string;
  user_id: string;
  project_id: string | null;
  original_url: string;
  processed_url: string | null;
  file_name: string;
  file_size: number;
  file_type: string;
  width: number | null;
  height: number | null;
  duration: number | null;
  media_type: MediaType;
  created_at: string;
}

export interface Filter {
  id: string;
  name: string;
  description: string;
  category: FilterCategory;
  thumbnail_url: string;
  preview_before_url: string | null;
  preview_after_url: string | null;
  settings: FilterSettings;
  is_premium: boolean;
  popularity_score: number;
  tags: string[];
  created_at: string;
}

export type FilterCategory =
  | "portrait"
  | "cinematic"
  | "travel"
  | "social_media"
  | "retro"
  | "gaming"
  | "luxury"
  | "nature"
  | "food"
  | "wedding";

export interface FilterSettings {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
  blur?: number;
  sharpen?: number;
  vignette?: number;
  grain?: number;
  temperature?: number;
  tint?: number;
  highlights?: number;
  shadows?: number;
  whites?: number;
  blacks?: number;
  lut?: string;
  overlay?: string;
  overlayOpacity?: number;
}

export interface Preset {
  id: string;
  user_id: string;
  name: string;
  settings: FilterSettings;
  is_public: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
}

export interface AIJob {
  id: string;
  user_id: string;
  upload_id: string | null;
  job_type: AIJobType;
  status: JobStatus;
  input_url: string;
  output_url: string | null;
  settings: Record<string, unknown>;
  error: string | null;
  processing_time: number | null;
  created_at: string;
  updated_at: string;
}

export type AIJobType =
  | "background_removal"
  | "upscale"
  | "enhance"
  | "style_transfer"
  | "color_grade"
  | "face_enhance"
  | "noise_removal"
  | "stabilize"
  | "subtitle_generation"
  | "slow_motion";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}

export interface PricingPlan {
  id: SubscriptionTier;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  credits: number;
  storageGB: number;
  isPopular?: boolean;
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
}

export interface FilterMarketplaceItem extends Filter {
  downloads: number;
  rating: number;
  review_count: number;
}

export interface EditorState {
  uploadedFile: File | null;
  processedUrl: string | null;
  originalUrl: string | null;
  activeFilter: Filter | null;
  customSettings: FilterSettings;
  isProcessing: boolean;
  history: string[];
  historyIndex: number;
}

export interface VideoEditorState {
  uploadedFile: File | null;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  activeTool: VideoTool;
  clips: VideoClip[];
  subtitles: Subtitle[];
  audioTrack: string | null;
  isProcessing: boolean;
  processedUrl: string | null;
}

export type VideoTool =
  | "trim"
  | "filter"
  | "subtitle"
  | "music"
  | "transitions"
  | "stabilize"
  | "color_grade";

export interface VideoClip {
  id: string;
  startTime: number;
  endTime: number;
  url: string;
  filter: FilterSettings | null;
}

export interface Subtitle {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  position: "top" | "center" | "bottom";
  style: SubtitleStyle;
}

export interface SubtitleStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  bold: boolean;
  italic: boolean;
}

export interface DashboardStats {
  totalProjects: number;
  imagesEdited: number;
  videosEdited: number;
  storageUsed: number;
  creditsUsed: number;
  exportsThisMonth: number;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  aiJobsToday: number;
  storageUsedTotal: number;
  newUsersThisWeek: number;
}
