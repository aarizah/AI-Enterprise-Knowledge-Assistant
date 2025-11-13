import { 
  FileText, 
  MessageSquare, 
  Search,
  Shield,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";

export const LANDING_FEATURES = [
  {
    icon: MessageSquare,
    title: "AI Chat with Citations",
    description: "Get instant answers from your company's knowledge base with verifiable citations."
  },
  {
    icon: FileText,
    title: "Document Integration",
    description: "Connect PDFs, Google Drive, Confluence, and Notion to centralize your knowledge."
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find information across all your internal documents with AI-powered semantic search."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Role-based access control, SSO integration, and data isolation for your organization."
  }
];

export const LANDING_STATS = [
  { icon: Users, value: "1,000+", label: "Active Users" },
  { icon: FileText, value: "100k+", label: "Documents Indexed" },
  { icon: Clock, value: "40%", label: "Time Saved" },
  { icon: CheckCircle, value: "92%", label: "Citation Rate" }
];

export const LANDING_BENEFITS = [
  "Instant answers with verifiable citations from your documents",
  "Reduce internal support tickets by 30%",
  "Save 4-6 hours per week per employee",
  "Intuitive chat interface with action triggers",
  "Connect multiple knowledge sources seamlessly",
  "Enterprise-grade security and data privacy"
];