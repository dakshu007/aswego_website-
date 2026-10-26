import type { StaticImageData } from "next/image";
import type { DisciplineId } from "./site";

import heroRoost from "@/assets/photos/hero-roost.jpg";
import mechieJungleTrack from "@/assets/photos/mechie-jungle-track.jpg";
import supercrossWhip from "@/assets/photos/supercross-whip.jpg";
import riderHelmetPortrait from "@/assets/photos/rider-helmet-portrait.jpg";
import launchRedStage from "@/assets/photos/launch-red-stage.jpg";
import cockpitOpenRoad from "@/assets/photos/cockpit-open-road.jpg";
import mistyTrack from "@/assets/photos/misty-track.jpg";
import rocketRockJump from "@/assets/photos/rocket-rock-jump.jpg";
import linenPortrait from "@/assets/photos/linen-portrait.jpg";
import coupleGarden from "@/assets/photos/couple-garden.jpg";
import onamFestive from "@/assets/photos/onam-festive.jpg";
import footGala25 from "@/assets/photos/foot-gala-25.jpg";
import jacketsDuo from "@/assets/photos/jackets-duo.jpg";
import trailGhatRide from "@/assets/photos/trail-ghat-ride.jpg";

/**
 * Photo library. To swap in a real photo, overwrite the file in src/assets/photos/
 * with the same name (any aspect ratio works) and update its `alt` so it describes
 * exactly what is in the frame — alt text is read by screen readers and AI search.
 */
export type Photo = {
  id: string;
  src: StaticImageData;
  title: string;
  alt: string;
  discipline: DisciplineId;
  place: string;
  year: string;
};

export const hero: Photo = {
  id: "hero-roost",
  src: heroRoost,
  title: "Roost on red earth",
  alt: "Motocross rider leaning into a berm and throwing red laterite dirt at golden hour",
  discipline: "motocross",
  place: "Kerala",
  year: "2025",
};

export const photos: Photo[] = [
  {
    id: "mechie-jungle-track",
    src: mechieJungleTrack,
    title: "Mechie",
    alt: "Rider on a green dirt bike sliding through a jungle motocross track lined with palms",
    discipline: "motocross",
    place: "Kerala",
    year: "2025",
  },
  {
    id: "supercross-whip",
    src: supercrossWhip,
    title: "Rise above all",
    alt: "Supercross rider whipping a motorcycle mid-air over a dirt jump in front of the crowd",
    discipline: "supercross",
    place: "National Supercross",
    year: "2025",
  },
  {
    id: "launch-red-stage",
    src: launchRedStage,
    title: "The reveal",
    alt: "New red motorcycle on a red launch stage under showroom spotlights",
    discipline: "machines",
    place: "Showroom launch",
    year: "2025",
  },
  {
    id: "rider-helmet-portrait",
    src: riderHelmetPortrait,
    title: "Before the gate",
    alt: "Close portrait of a rider in a helmet and race jersey before the start",
    discipline: "portraits",
    place: "Paddock",
    year: "2025",
  },
  {
    id: "misty-track",
    src: mistyTrack,
    title: "Morning mist",
    alt: "Lone dirt bike rider kicking up dust on a misty, empty motocross track",
    discipline: "motocross",
    place: "Kerala",
    year: "2025",
  },
  {
    id: "cockpit-open-road",
    src: cockpitOpenRoad,
    title: "Open road",
    alt: "Rider's view over a motorcycle cockpit and tank down an empty tree-lined road",
    discipline: "machines",
    place: "Western Ghats",
    year: "2025",
  },
  {
    id: "rocket-rock-jump",
    src: rocketRockJump,
    title: "Rocket rock",
    alt: "Motocross rider launching off a dirt ramp, front wheel up, against the sky",
    discipline: "supercross",
    place: "Race weekend",
    year: "2025",
  },
  {
    id: "linen-portrait",
    src: linenPortrait,
    title: "Linen & light",
    alt: "Man in a white linen shirt sitting in tall grass in warm evening light",
    discipline: "portraits",
    place: "Kerala",
    year: "2025",
  },
  {
    id: "foot-gala-25",
    src: footGala25,
    title: "Foot Gala '25",
    alt: "Floodlit football turf at night during the Foot Gala 2025 tournament",
    discipline: "events",
    place: "Foot Gala",
    year: "2025",
  },
  {
    id: "couple-garden",
    src: coupleGarden,
    title: "Everyday life",
    alt: "Couple laughing together beside a wall of tropical leaves and flowers",
    discipline: "portraits",
    place: "Kerala",
    year: "2025",
  },
  {
    id: "onam-festive",
    src: onamFestive,
    title: "Onam",
    alt: "Hands arranging a flower pookalam carpet for an Onam festive brand shoot",
    discipline: "events",
    place: "Onam campaign",
    year: "2025",
  },
  {
    id: "jackets-duo",
    src: jacketsDuo,
    title: "Two of a kind",
    alt: "Two friends in jackets and checked shirts posing in soft forest light",
    discipline: "portraits",
    place: "Kerala",
    year: "2025",
  },
  {
    id: "trail-ghat-ride",
    src: trailGhatRide,
    title: "Ghat trail",
    alt: "Adventure motorcycle climbing a red dirt trail through green hills",
    discipline: "machines",
    place: "Western Ghats",
    year: "2025",
  },
];

/** Cover image per chapter (discipline). */
export const chapterCovers: Record<DisciplineId, Photo> = {
  motocross: photos[0],
  supercross: photos[1],
  machines: photos[2],
  portraits: photos[7],
  events: photos[8],
};
