import { Experience } from "./scene/Experience";
import { Overlay } from "./ui/Overlay";

export default function App() {
  return (
    <>
      <Experience />
      <Overlay />
      <div id="story" />
      <article className="sr">
        <h1>Nexus</h1>
        <p>A modern factory is a system of systems. The site contains raw material, production, chemical processing, utilities, a quality laboratory, packaging, a warehouse, and waste treatment.</p>
        <p>Inside the chemical processing plant, reactors, tanks, pipes, and instruments generate temperature, pressure, flow, vibration, level, batch, and quality data. Every part of the plant generates data, but it does not all live in the same place.</p>
        <p>ERP, MES, LIMS, DCS, the historian, CMMS, quality, engineering, documents, sensors, and databases each hold a fragment. The physical plant is one system. The information is not.</p>
        <p>On Reactor R-204, temperature drifts, pressure and vibration move with it, and Batch B-2047 is flagged for a quality deviation.</p>
        <p>Operations, quality, maintenance, supply chain, engineering, production, and data teams can each see a slice. The information exists. The context is scattered.</p>
        <p>Nexus connects what already exists. It does not replace those systems. A semantic layer relates the reactor to its sensors, process history, batches, raw-material lots, suppliers, quality results, maintenance, documents, and customers.</p>
        <p>Ask anything about your plant. Why did Batch B-2047 fail quality inspection?</p>
        <p>Potential contributing factors: raw-material lot RM-1832 was used in Batch B-2047; Reactor R-204 underwent maintenance 18 hours before production; process temperature deviated from the historical operating range; three previous batches exhibited similar process behaviour. These are correlated events and historical similarity, not a determined cause.</p>
        <p>A digital twin is more than a 3D model. It is a connected model of the system behind the plant.</p>
        <p>One factory. One context. Nexus connects the systems, data and relationships across the plant into a queryable intelligence layer and digital twin.</p>
      </article>
    </>
  );
}
