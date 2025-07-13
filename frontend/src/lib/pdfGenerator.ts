import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getPlanEJALogoBase64 } from './svgToBase64';

export interface PDFPlanData {
  title: string;
  discipline: string;
  level: string;
  theme: string;
  durationMinutes: number;
  quantity: number;
  resources: string[];
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export const generatePDF = async (planData: PDFPlanData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  const headerHeight = 40; // Altura reservada para o cabeçalho
  
  let yPosition = margin;

  // Configurações de fonte
  const titleFontSize = 18;
  const sectionFontSize = 14;
  const contentFontSize = 12;

  // Título principal
  pdf.setFontSize(titleFontSize);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  
  const titleLines = pdf.splitTextToSize(planData.title, contentWidth);
  pdf.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 8 + 10;

  // Informações básicas
  pdf.setFontSize(contentFontSize);
  pdf.setFont('helvetica', 'normal');
  
  const basicInfo = [
    `Disciplina: ${planData.discipline}`,
    `Nível: ${planData.level}`,
    `Tema: ${planData.theme}`,
    `Duração: ${planData.durationMinutes} minutos`,
    `Quantidade de aulas: ${planData.quantity}`,
    `Recursos: ${planData.resources.join(', ')}`
  ];

  basicInfo.forEach(info => {
    const lines = pdf.splitTextToSize(info, contentWidth);
    pdf.text(lines, margin, yPosition);
    yPosition += lines.length * 6 + 2;
  });

  yPosition += 10;

  // Seções do plano
  planData.sections.forEach(section => {
    // Verificar se precisa de nova página (considerando o cabeçalho)
    if (yPosition > pageHeight - headerHeight) {
      pdf.addPage();
      yPosition = margin;
    }

    // Título da seção
    pdf.setFontSize(sectionFontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 100, 200); // Azul
    pdf.text(section.title, margin, yPosition);
    yPosition += 8;

    // Conteúdo da seção
    pdf.setFontSize(contentFontSize);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    
    const contentLines = pdf.splitTextToSize(section.content, contentWidth);
    
    // Verificar se o conteúdo cabe na página atual
    const contentHeight = contentLines.length * 6;
    if (yPosition + contentHeight > pageHeight - headerHeight) {
      // Se não couber, quebrar o conteúdo em páginas
      let currentLine = 0;
      while (currentLine < contentLines.length) {
        // Verificar se precisa de nova página
        if (yPosition > pageHeight - headerHeight) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Adicionar linhas que cabem na página atual
        const linesForThisPage = [];
        let linesHeight = 0;
        
        while (currentLine < contentLines.length && linesHeight < (pageHeight - headerHeight - yPosition)) {
          linesForThisPage.push(contentLines[currentLine]);
          linesHeight += 6;
          currentLine++;
        }
        
        if (linesForThisPage.length > 0) {
          pdf.text(linesForThisPage, margin, yPosition);
          yPosition += linesHeight + 10;
        }
      }
    } else {
      // Se couber tudo na página atual
      pdf.text(contentLines, margin, yPosition);
      yPosition += contentHeight + 10;
    }
  });

  // Adicionar marca PlanEJA no rodapé de cada página
  const addFooter = async () => {
    try {
      // Adicionar logo SVG
      const logoBase64 = await getPlanEJALogoBase64();
      const logoWidth = 30;
      const logoHeight = 10;
      const logoX = pageWidth - logoWidth - 10;
      const logoY = pageHeight - logoHeight - 5;
      
      pdf.addImage(logoBase64, 'SVG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.error('Erro ao adicionar logo:', error);
      // Fallback para texto se o logo falhar
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 64, 175);
      pdf.text('PlanEJA', pageWidth - 35, pageHeight - 10);
    }
  };

  // Adicionar rodapé em todas as páginas
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    await addFooter();
  }

  // Salvar o PDF
  const fileName = `plano_aula_${planData.discipline.toLowerCase()}_${new Date().getTime()}.pdf`;
  pdf.save(fileName);
};

export const generatePDFFromElement = async (elementId: string, planData: PDFPlanData): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Calcular dimensões da imagem para caber na página
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 10;

    // Adicionar primeira página
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;

    // Adicionar páginas adicionais se necessário
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;
    }

    // Adicionar marca PlanEJA no rodapé
    const addFooter = async () => {
      try {
        // Adicionar logo SVG
        const logoBase64 = await getPlanEJALogoBase64();
        const logoWidth = 30;
        const logoHeight = 10;
        const logoX = pageWidth - logoWidth - 10;
        const logoY = pageHeight - logoHeight - 5;
        
        pdf.addImage(logoBase64, 'SVG', logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        console.error('Erro ao adicionar logo:', error);
        // Fallback para texto se o logo falhar
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 64, 175);
        pdf.text('PlanEJA', pageWidth - 35, pageHeight - 10);
      }
    };

    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      await addFooter();
    }

    const fileName = `plano_aula_${planData.discipline.toLowerCase()}_${new Date().getTime()}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}; 