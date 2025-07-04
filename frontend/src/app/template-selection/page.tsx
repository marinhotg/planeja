import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TemplateSelectionForm from '../components/ui/TemplateSelectionForm';

export default function TemplateSelectionPage() {
  return (
    <div className="bg-white overflow-hidden flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-[800px] px-4 py-6 bg-white flex flex-col justify-start items-center gap-12">
          <TemplateSelectionForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}