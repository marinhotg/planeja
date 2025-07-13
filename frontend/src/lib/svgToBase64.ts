export const convertSVGToBase64 = async (svgPath: string): Promise<string> => {
  try {
    const response = await fetch(svgPath);
    const svgText = await response.text();
    
    // Converter SVG para base64
    const base64 = btoa(svgText);
    return `data:image/svg+xml;base64,${base64}`;
  } catch (error) {
    console.error('Erro ao converter SVG para base64:', error);
    throw error;
  }
};

export const getPlanEJALogoBase64 = async (): Promise<string> => {
  return convertSVGToBase64('/planeja-logo.svg');
}; 