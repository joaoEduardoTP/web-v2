import { monitoringColumn } from "@/components/monitoring-columns";
import { MonitoringDataTable } from "@/components/monitoring-data-table";
import { documentService as apiDocumentService } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

const MonitoringPage = () => {
  const credentials = useAuthStore((state) => state.user);
  
  if (!credentials) {
    return null;
  }
  const { user, bases } = credentials;


  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["all-documents"],
    queryFn: async () => await apiDocumentService.getAllDocuments(),
  });


  return (
    user && bases && (
      <div className="max-w-[92vw] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Monitoramento de Documentos
          </h1>
        </div>


        {/* Data Table */ }
        <div className="mb-8">
          <MonitoringDataTable
            isLoading={ isLoading }
            isError={ isError }
            columns={ monitoringColumn }
            data={ data }
          />
        </div>


      </div>
    )
  );
};

export default MonitoringPage;