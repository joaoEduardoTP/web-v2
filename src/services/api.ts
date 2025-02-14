import { formatDeliveryMethod } from "@/lib/utils";
import { DeliveryMethod, DeliveryData as DispatchDocumentsPayload, ReceivedDocumentsPayload, SendDocumentFilters, SendDocumentsPayload, TravelDocument } from "@/types";
import { formatDates, parseDates, } from "@/utils/date-formatter";


import axios from 'axios';
import Cookies from 'js-cookie';

const API = import.meta.env.VITE_API_URL // Nest

const PORTAL_URL = import.meta.env.VITE_PORTAL_URL;

// const PORTAL_API = 'https://www.meuportal.com.br';



const api = axios.create({
  baseURL: API,
});


api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token_cookie");
  if (token) {
    config.headers.Authorization = `Bearer ${ token }`;
  }
  return config;
});

export const documentService = {

  // Entrega
  getTravelDocuments: async (filters: SendDocumentFilters): Promise<TravelDocument[]> => {
    const { baseId, ...rest } = filters;
    console.log('Filtros', filters)

    const response = await api.get(
      `${ API }/travel-documents`,
      { params: {...rest},
        headers: {
        'base-id': baseId
        }
      }
    );

    
    const travelDocuments = formatDates(await response.data)
    
    setTimeout(() => {
      console.log('DOCUMENTOS', travelDocuments)
    },1500)

    return travelDocuments;
  },

  sendDocuments: async (documentsPayload: SendDocumentsPayload) => {
    const {baseId, documents, receiptDate,receiptEmail} = documentsPayload
    const formattedDocuments = parseDates(documents)
    console.log('EU ESTOU AQUI')


    
    const payload = { 
      status: 'Entregue na Base',
      baseId,
      documents: formattedDocuments,
      receiptDate,
      receiptEmail
    }


    console.log('PAYLOAD PARA ENVIAR OS DOCUMETNOS',payload)
    
  
    const response = await axios.post(
      `${ API }/travel-documents/confirm`,
      payload,
    );

    console.log('RESPOSTA DO ENVIO',await response.data)
    console.log('RESPOSTA DO ENVIO', response.status)

    return await response.data;
  },

  // Envio
  getRegisteredDocumentsByBase: async (baseId: string) =>{
  

    const response = await axios.get(`${ API }/travel-documents/delivered`,{ headers: { 'base-id':baseId  } });
    
    const registeredDocuments = formatDates(await response.data)
    
    console.log(registeredDocuments)
    return  registeredDocuments
  },
  dispatchDocuments: async (documentsPayload: DispatchDocumentsPayload) => {
    console.log('PAYLOAD',documentsPayload)
    const response = await axios.post(`${ API }/travel-documents/dispatch`, documentsPayload);
    return await response.data
  },

  // Recebimento
  getArrivedDocuments: async (baseId: string) => {
    const response = await axios.get(`${ API }/travel-documents/arrived`, { headers: { 'base-id': baseId } });
    const getArrivedDocuments = formatDates(await response.data)
    return getArrivedDocuments
  },
  setDocumentsAsReceived: async (documentsPayload: ReceivedDocumentsPayload) => {
    console.log('PAYLOAD: documentsAsReceived',documentsPayload)
    const response = await axios.post(`${ API }/travel-documents/receive`, documentsPayload);
    return response.data;
  },


  // Monitoramento

  getAllDocuments: async () => {
    const response = await axios.get(`${ API }/travel-documents/all`);

    const formatedDates = formatDates(await response.data)
    const documents = formatedDates.map((document) => {
      return {
        ...document,
        sendDate: document.sendDate || 'Não informado',
        sendEmail: document.sendEmail || 'Não informado',

        dischargeDate: document.dischargeDate || 'Não informado',
        dischargeEmail: document.dischargeEmail || 'Não informado',

        tracking: document.tracking || 'Não informado',

        endDate: document.endDate || 'Não informado',
        unloadingEndDate: document.unloadingEndDate || 'Não informado',
        sendMethod: document.sendMethod?  formatDeliveryMethod(document.sendMethod as DeliveryMethod) : 'Não informado'
      }
    })
    console.log( 'OS DOCUMENTOS', documents)
    return documents

    // const documentsWithDates = formatDates(await response.data).map((document.) => {
    //   return {
        
    //   };
    // })
    // console.log(documentsWithDates)

    // const frota = formatDeliveryMethod('frota_propria');
    // const onibus = formatDeliveryMethod('onibus');
    // const correios = formatDeliveryMethod('correios');


    // console.log(frota, onibus, correios)


    // console.log('Documentos', documentsWithDates)

    // return documentsWithDates
  }
}



// export const baseService = {
//   getBases: async (): Promise<Base[]> => {

//     try {
//       const bases = await axios.get(`${ API }/bases`);
//       return await bases.data;
//     } catch (err) {
//       console.log(err);
//       return [];
//     }
//   },

//   saveBase: async (base: Base): Promise<void> => {
//     const { id, ...newBase } = base;
//     if (id) {
//       try {
//         const response = await axios.put(`${ API }/bases/${ id }`, newBase);
//         return response.data;
//       } catch (err) {
//         console.log(err);
//         return;
//       }
//     }


//     try {
//       const response = await axios.post(`${ API }/bases`, newBase);
//       // console.log(response.data);
//       return response.data;
//     } catch (err) {
//       console.log(err);
//       return;
//     }

//   },

//   deleteBase: async (id: string): Promise<void> => {
//     try {
//       const response = await axios.delete(`${ API }/bases/${ id }`);
//       return response.data;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// };

// Document Service


  
  // getSentDocuments: async (): Promise<Envelope[]> => {
  //   const docs = localStorage.getItem('sent-documents');
  //   return docs ? JSON.parse(docs) : [];
  // },




//   getProtocols: async (): Promise<Protocol[]> => {
//     const protocols = localStorage.getItem('protocols');
//     return protocols ? JSON.parse(protocols) : [];
//   },

//   saveSentDocument: async (doc: Envelope): Promise<Envelope> => {
//     const docs = await documentService.getSentDocuments();
//     const updatedDocs = [...docs, doc];
//     localStorage.setItem('sent-documents', JSON.stringify(updatedDocs));
//     return doc;
//   },

//   saveTravelDocument: async (doc: TravelDocument) => { // (doc: TravelDocument): Promise<TravelDocument> => {
//     console.log(doc);

//     // const docs = await documentService.getTravelDocuments();
//     // const updatedDocs = [...docs, doc];
//     // localStorage.setItem('travel-documents', JSON.stringify(updatedDocs));
//     return doc;
//   },

//   saveProtocol: async (protocol: Protocol): Promise<Protocol> => {
//     const protocols = await documentService.getProtocols();
//     const updatedProtocols = [...protocols, protocol];
//     localStorage.setItem('protocols', JSON.stringify(updatedProtocols));
//     return protocol;
//   },

//   deleteSentDocument: async (id: string): Promise<void> => {
//     const docs = await documentService.getSentDocuments();
//     const updatedDocs = docs.filter(d => d.id !== id);
//     localStorage.setItem('sent-documents', JSON.stringify(updatedDocs));
//   }
// };





// export const authApi = {
//   // Função para buscar o token JWT do portal
//   fetchTokenFromPortal: async (): Promise<string> => {
//     try {
//       const response = await axios.get<{ token: string; }>(
//         `${ PORTAL_API }/api/token`,
//       );

//       const token = response.data.token;

//       if (!token) {
//         throw new Error("Token não encontrado na resposta do portal.");
//       }


//       return token;
//     } catch (error: any) {
//       if (axios.isAxiosError(error)) {
//         throw new Error(
//           error.response?.data?.message ||
//           "Erro ao obter o token do portal."
//         );
//       } else {
//         throw new Error("Erro desconhecido ao obter o token do portal.");
//       }
//     }
//   },
// };





