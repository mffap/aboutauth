import Link from "@docusaurus/Link";
import SoftwareProviders from "./software";
import React from "react";

export default function SoftwareTable() {

  const opt = { open_source_only: false };
  const processors = SoftwareProviders(opt);

  return (
    <table className="text-xs">
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Cloud Service</th>
        <th>Self Hosted</th>
        <th>Open Source</th>
      </tr>
      {
        processors
          .sort((a, b) => {
            if (a.title < b.title) return -1
            if (a.title > b.title) return 1
            else return 0
          })
          .map((processor, rowID) => {
          return (
            <tr>
              <td key={rowID}><Link href={processor.link}>{processor.title}</Link></td>
              <td>{processor.description}</td>
              <td>{processor.cloud_service ? 'Yes'  : 'No'}</td>
              <td>{processor.self_hosted ? 'Yes'  : 'No'}</td>
              <td>{processor.open_source ? 'Yes'  : 'No'}</td>
            </tr>
          )
        })
      }
    </table>
  );
}