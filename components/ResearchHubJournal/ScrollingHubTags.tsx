import { css, StyleSheet } from "aphrodite";
import HubTag from "~/components/Hubs/HubTag";
import { useEffect, useState } from "react";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";

const HUBS = [
  "Biochemistry",
  "Genetics",
  "Molecular Biology",
  "Cancer Research",
  "Molecular Medicine",
  "Structural Biology",
  "Biophysics",
  "Biotechnology",
  "Endocrinology",
  "Clinical Biochemistry",
  "Physiology",
  "Developmental Biology",
  "Immunology",
  "Virology",
  "Parasitology",
  "Microbiology",
  "Applied Microbiology and Biotechnology",
  "Cognitive Neuroscience",
  "Cellular and Molecular Neuroscience",
  "Sensory Systems",
  "Endocrine and Autonomic Systems",
  "Behavioral Neuroscience",
  "Neurology",
  "Developmental Neuroscience",
  "Biological Psychiatry",
  "Pharmaceutical Science",
  "Pharmacology",
  "Toxicology",
  "Drug Discovery"
];

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars (except hyphens)
    .replace(/\-\-+/g, '-')   // Replace multiple hyphens with single hyphen
    .trim();                  // Trim hyphens from start and end
};

const HUB_URL_OVERRIDES = {
  "Molecular Biology": "molecular-biology-1",
  "Pharmaceutical Science": "pharmaceutical-science-1",
  "Pharmacology": "pharmacology-and-toxicology",
  // Add more overrides as needed
};

export default function ScrollingHubTags(): JSX.Element {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const itemWidth = 150;
    const totalWidth = HUBS.length * itemWidth;
    let animationFrameId: number;
    let lastTimestamp: number;
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      
      setOffset((prev) => {
        // Smoother animation based on time passed
        const pixelsPerSecond = 30; // Adjust speed here
        const newOffset = prev + (pixelsPerSecond * delta / 1000);
        return newOffset >= totalWidth ? 0 : newOffset;
      });
      
      lastTimestamp = timestamp;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className={css(styles.container)}>
      <div className={css(styles.clipContainer)}>
        <div 
          className={css(styles.scrollTrack)} 
          style={{ 
            transform: `translate3d(-${offset}px, 0, 0)`,
            willChange: 'transform'
          }}
        >
          {[...HUBS, ...HUBS].map((name, i) => (
            <div key={i} className={css(styles.hubTagWrapper)}>
              <HubTag 
                hub={{ 
                  name,
                  slug: HUB_URL_OVERRIDES[name] ? 
                    HUB_URL_OVERRIDES[name].replace('/hubs/', '') : 
                    slugify(name)
                }} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    padding: "20px 0",
  },
  clipContainer: {
    width: "80%",
    margin: "0 auto",
    overflow: "hidden",
    position: "relative",
    ":before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 100,
      background: `linear-gradient(to right, ${colors.NEW_BLUE(0.75)} 0%, transparent 30%)`,
      zIndex: 2,
      pointerEvents: "none",
    },
    ":after": {
      content: '""',
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 100,
      background: `linear-gradient(to left, ${colors.NEW_BLUE(0.75)} 0%, transparent 30%)`,
      zIndex: 2,
      pointerEvents: "none",
    },
  },
  scrollTrack: {
    display: "flex",
    gap: 16,
    whiteSpace: "nowrap",
    transition: "none", // Remove transition since we're using requestAnimationFrame
    backfaceVisibility: 'hidden', // Optimization for compositing
  },
  hubTagWrapper: {
    display: "inline-block",
    background: colors.WHITE(0.75),
    borderRadius: 13,
    transition: "all 0.2s ease",
    ":hover": {
      transform: "scale(1.05)",
      zIndex: 3,
    },
  },
}); 