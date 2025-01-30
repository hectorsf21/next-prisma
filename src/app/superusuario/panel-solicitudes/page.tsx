import DocumentComponents from '@/components/DocumentComponents'
import TramitesComponent from '@/components/TramitesComponents'
import React from 'react'

export default function panelSolicitudes() {
    return (
      <>
        <div className="flex flex-col gap-6 p-4">
          <TramitesComponent />
          <DocumentComponents />
        </div>
      </>
    );
  }
  