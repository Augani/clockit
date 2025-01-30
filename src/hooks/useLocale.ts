import { usePathname } from 'next/navigation';

const useLocale = () => {
  const pathname = usePathname();
  const locale = pathname.split('/')[1]; // Assuming locale is the first segment
  return locale;
};

export default useLocale; 