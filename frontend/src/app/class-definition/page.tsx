import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ClassDefinitionForm from '../components/ui/ClassDefinitionForm';

export default function LessonDefinitionPage() {
  return (
    <div className="bg-white overflow-hidden flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-[800px] px-4 py-6 bg-white flex flex-col justify-start items-center gap-12">
          <ClassDefinitionForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}