import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  RefreshCw, 
  AlertCircle,
  Play,
  Heart,
  Download 
} from 'lucide-react';

// 將 Lucide 的圖示重新命名並匯出，讓全站統一名稱
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;

/** * 用於表示發展面向是否達標 [cite: 23, 30, 37, 113]
 * CheckIcon 對應「是/通過」，XMarkIcon 對應「否/不通過」 
 */
export const CheckIcon = Check;
export const XMarkIcon = X;

export const RefreshIcon = RefreshCw;
export const PlayIcon = Play;

/** * 用於顯示「步步熊的暖心建議」區塊，給予家長心理支持 
 */
export const HeartIcon = Heart;

/** * 修正：同時導出 AlertIcon 與 AlertCircleIcon
 * 確保 AssessmentScreen 的施測指引與 ResultsScreen 的醫療免責聲明都能正確顯示
 */
export const AlertIcon = AlertCircle;
export const AlertCircleIcon = AlertCircle;
export const DownloadIcon = Download;