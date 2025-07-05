import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import RegisterForm from '../components/ui/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="bg-sky-100 overflow-hidden flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 pt-16 m-16">
        <div className="w-full max-w-md px-8 py-10 bg-white rounded-xl flex flex-col justify-start items-center gap-10 overflow-hidden">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}