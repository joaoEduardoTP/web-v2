import React from 'react';

const teste = () => {
  return (
    {/* Documents Table */ }
      {
    documents.length > 0 && (
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Documentos Encontrados</h3>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Número</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead className="text-right">Selecionar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { documents.map((document: TravelDocument) => (
                <TableRow
                  key={ document.id }
                  className={ `hover:bg-background cursor-pointer ${ selectedDocuments.includes(document.id)
                    ? "bg-blue-100"
                    : ""
                    }` }
                  onClick={ () => handleDocumentSelect(document.id) }
                >
                  <TableCell className="font-medium">
                    { document.number }
                  </TableCell>
                  <TableCell>{ document.driver }</TableCell>
                  <TableCell className="text-right">
                    <input
                      type="checkbox"
                      checked={ selectedDocuments.includes(document.id) }
                      onChange={ () => handleDocumentSelect(document.id) }
                      onClick={ (e) => e.stopPropagation() }
                    />
                  </TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  )
}

export default teste;