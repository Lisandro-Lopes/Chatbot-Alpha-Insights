import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle2, Zap, Sparkles, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticação
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      navigate("/");
    }
  }, [navigate]);

  const normalizeColumnName = (name: string): string => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
  };

  const handleFileUpload = async (monthIndex: number, file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validar se há dados
      if (jsonData.length === 0) {
        throw new Error("Planilha vazia");
      }

      // Normalizar os nomes das colunas para garantir compatibilidade
      const normalizedData = jsonData.map((row: any) => {
        const normalizedRow: any = {};
        Object.keys(row).forEach(key => {
          const normalizedKey = normalizeColumnName(key);
          normalizedRow[normalizedKey] = row[key];
        });
        return normalizedRow;
      });

      // Verificar se há pelo menos algumas colunas de dados
      const firstRow = normalizedData[0];
      const columnCount = Object.keys(firstRow).length;
      
      if (columnCount < 3) {
        throw new Error("Planilha precisa ter pelo menos 3 colunas de dados");
      }

      // Salvar no localStorage com dados normalizados
      localStorage.setItem(`sales_${monthIndex}`, JSON.stringify(normalizedData));
      localStorage.setItem(`sales_${monthIndex}_original`, JSON.stringify(jsonData));
      
      setUploadedFiles(prev => ({ ...prev, [monthIndex]: true }));
      toast({
        title: "Upload concluído",
        description: `Planilha de ${MONTHS[monthIndex]} carregada com sucesso! (${normalizedData.length} linhas, ${columnCount} colunas)`,
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro ao processar planilha",
        variant: "destructive",
      });
    }
  };

  const allFilesUploaded = Object.keys(uploadedFiles).length === 12;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Header */}
      <header className="border-b border-border/50 glass-effect sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">DataPulse Analytics</h1>
                <p className="text-xs text-muted-foreground">Central de Importação</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate("/home")}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Início
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow animate-glow">
              <UploadIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-4xl font-bold">Upload de Planilhas</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Faça upload das 12 planilhas mensais para análise completa
            </p>
          </div>

          {/* Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONTHS.map((month, index) => (
              <Card key={index} className="p-5 glass-effect border-border/50 hover-lift group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl gradient-primary shadow-glow group-hover:scale-110 transition-transform">
                        <FileSpreadsheet className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg">{month}</h3>
                    </div>
                    {uploadedFiles[index] && (
                      <CheckCircle2 className="h-5 w-5 text-secondary animate-pulse" />
                    )}
                  </div>
                  
                  <label className="block">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(index, file);
                      }}
                    />
                    <Button 
                      variant={uploadedFiles[index] ? "secondary" : "default"}
                      className="w-full rounded-xl h-10 text-sm"
                      asChild
                    >
                      <span className="cursor-pointer">
                        <UploadIcon className="h-4 w-4 mr-2" />
                        {uploadedFiles[index] ? "Atualizar" : "Fazer Upload"}
                      </span>
                    </Button>
                  </label>
                </div>
              </Card>
            ))}
          </div>

          {/* Success Message */}
          {allFilesUploaded && (
            <Card className="p-8 gradient-primary text-primary-foreground shadow-glow animate-slide-up">
              <div className="text-center space-y-4">
                <div className="inline-flex p-3 bg-white/10 rounded-full">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Sincronização Completa!</h3>
                  <p className="text-primary-foreground/90">
                    Todos os dados foram carregados. Inicie a análise
                  </p>
                </div>
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/bot")}
                  className="px-6 h-11 rounded-xl"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Iniciar Análise
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Upload;
