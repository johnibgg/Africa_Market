export type UserRole = "BUYER" | "SELLER" | "ADMIN" | "DELIVERY"

export type VerificationStatus = "NONE" | "PENDING" | "VERIFIED" | "REJECTED"

export type ListingType = "PRODUCT" | "SERVICE"

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"

export type ListingStatus = "active" | "draft" | "suspended" | "sold"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: UserRole
  location: string
  bio: string
  isVerified: boolean
  verificationStatus?: VerificationStatus
  idCardUrl?: string
  idNumber?: string
  verificationPhotoUrl?: string
  rating: number
  reviewCount: number
  listingsCount: number
  joinedAt: string
  shopName?: string
  shopDescription?: string
  subscription?: "basic" | "pro" | "vip"
}

export interface Category {
  id: string
  name: string
  nameFr: string
  icon: string
  slug: string
  count: number
  subcategories?: Category[]
}

export interface Listing {
  id: string
  title: string
  description: string
  type: ListingType
  price: number
  currency: string
  images: string[]
  videoUrl?: string
  category: string
  categoryId: string
  subcategory?: string
  seller: User
  location: string
  quartier?: string
  rating: number
  reviewCount: number
  views: number
  isPromoted: boolean
  isFavorited: boolean
  status: ListingStatus
  createdAt: string
  updatedAt: string
  tags: string[]
  availability?: string
  deliveryAvailable: boolean
  condition?: "new" | "used" | "refurbished"
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  listingId: string
  rating: number
  comment: string
  createdAt: string
  sellerResponse?: string
}

export interface DeliveryBid {
  id: string
  delivererId: string
  delivererName: string
  delivererRating: number
  delivererAvatar: string
  price: number
  comment?: string
  createdAt: string
}

export interface OrderItem {
  listing: Listing
  quantity: number
  price: number
}

export interface Order {
  id: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerName: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  paymentMethod: string
  deliveryAddress: string
  deliveryLat?: number
  deliveryLng?: number
  sellerLat?: number
  sellerLng?: number
  createdAt: string
  updatedAt: string
  trackingNumber?: string
  deliveryBids?: DeliveryBid[]
  selectedBidId?: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
  attachment?: string
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage: Message
  unreadCount: number
  listingId?: string
  listingTitle?: string
}

export interface CartItem {
  listing: Listing
  quantity: number
}

export interface Video {
  id: string
  title: string
  thumbnailUrl: string
  videoUrl: string
  views: number
  likes: number
  sellerId: string
  sellerName: string
  listingId?: string
  createdAt: string
}

export interface DeliveryTask {
  id: string
  orderId: string
  delivererId?: string
  pickupAddress: string
  deliveryAddress: string
  status: "pending" | "picked_up" | "in_transit" | "delivered"
  estimatedTime: string
  fee: number
  buyerName: string
  sellerName: string
  currentLat?: number
  currentLng?: number
  trajectory?: { lat: number; lng: number }[]
}

export interface DashboardStats {
  totalSales: number
  totalOrders: number
  totalListings: number
  averageRating: number
  revenue: number
  views: number
  conversionRate: number
  monthlyData: { month: string; sales: number; revenue: number }[]
}

export interface AdminStats {
  totalUsers: number
  totalListings: number
  totalOrders: number
  totalRevenue: number
  newUsersToday: number
  newListingsToday: number
  pendingModeration: number
  monthlyData: { month: string; users: number; listings: number; revenue: number }[]
}

export interface Notification {
  id: string
  userId: string
  type: "order" | "message" | "system" | "promotion"
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}
