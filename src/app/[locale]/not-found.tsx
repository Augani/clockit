import Logo from '@/app/Logo';
import Button from '@/components/Button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');
  const navT = useTranslations('nav');

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-4">
        {/* Header */}
        <div className="flex flex-row justify-between p-3 px-10">
          <Link className="flex flex-row items-center" href="/">
            <Logo width={60} height={60} />
            <h1 className="text-xl font-semibold text-primary">
              {navT('name')}
            </h1>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center flex-grow py-20 text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">{t('title')}</h1>
          <p className="text-xl text-muted mb-8">{t('description')}</p>
          <Link href="/">
            <Button variant="contained" className="px-6 py-2">
              {t('backHome')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
