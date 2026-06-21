import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Brain, Calendar, Lock } from "lucide-react";

const BIASES = [
  {
    name: "Biais de confirmation",
    short: "On cherche surtout ce qui confirme ce qu'on pense déjà.",
    example:
      "Tu penses qu'un signe astrologique décrit bien quelqu'un — tu remarques chaque fois que ça colle, et tu oublies les fois où ça loupe complètement.",
    tag: "Croyances",
  },
  {
    name: "Biais du survivant",
    short: "On tire des leçons des gagnants, en oubliant tous les perdants invisibles.",
    example:
      "« Tous les entrepreneurs à succès ont arrêté l'école » — sauf qu'on ne voit jamais les milliers qui ont arrêté l'école et n'ont rien réussi.",
    tag: "Décision",
  },
  {
    name: "Effet de halo",
    short: "Une qualité visible influence notre jugement sur tout le reste.",
    example:
      "Une personne séduisante nous paraît automatiquement plus intelligente ou plus sympa, sans aucune preuve réelle.",
    tag: "Perception",
  },
  {
    name: "Biais d'ancrage",
    short: "Le premier chiffre vu influence tout le jugement qui suit.",
    example:
      "Un prix barré à 200 € à côté d'un prix réel à 90 € fait paraître le 90 € comme une affaire, même si c'est encore cher en soi.",
    tag: "Argent",
  },
  {
    name: "Biais de négativité",
    short: "Le négatif marque bien plus fort que le positif.",
    example:
      "Une soirée géniale avec un seul moment gênant — c'est ce moment-là qu'on rumine en rentrant chez soi.",
    tag: "Émotions",
  },
  {
    name: "Effet Dunning-Kruger",
    short: "Moins on connaît un sujet, plus on a tendance à se surestimer dessus.",
    example:
      "Un débutant en bourse est souvent plus sûr de lui qu'un trader expérimenté, qui lui voit toute la complexité du marché.",
    tag: "Compétence",
  },
  {
    name: "Biais de disponibilité",
    short: "On juge la fréquence d'un risque selon la facilité à s'en souvenir.",
    example:
      "Après un reportage sur un crash d'avion, on a plus peur de prendre l'avion que la voiture — alors que la voiture est statistiquement bien plus dangereuse.",
    tag: "Risque",
  },
  {
    name: "Biais rétrospectif",
    short: "Après coup, un événement nous semble avoir été prévisible.",
    example:
      "Après une rupture, on se dit « je savais que ça allait mal finir » — alors qu'au moment où ça se passait, rien n'était si évident.",
    tag: "Mémoire",
  },
  {
    name: "Effet de simple exposition",
    short: "On finit par aimer ce qu'on voit souvent, juste par familiarité.",
    example:
      "Une chanson qu'on trouvait quelconque devient un de nos titres préférés à force de l'entendre passer à la radio.",
    tag: "Préférences",
  },
  {
    name: "Biais d'optimisme",
    short: "On sous-estime sa propre probabilité de subir un événement négatif.",
    example:
      "Tout le monde sait que fumer est dangereux — mais beaucoup de fumeurs pensent que ça arrive « aux autres », pas à eux.",
    tag: "Risque",
  },
  {
    name: "Coût irrécupérable (sunk cost)",
    short: "On continue un projet à cause de ce qu'on y a déjà investi, pas de sa valeur future.",
    example:
      "Finir un mauvais film au cinéma « parce qu'on a déjà payé la place », alors que partir maintenant ferait gagner du temps.",
    tag: "Décision",
  },
  {
    name: "Biais de statu quo",
    short: "On préfère que les choses restent comme elles sont, même si une autre option serait meilleure.",
    example:
      "Rester sur le même forfait téléphone pendant des années alors qu'un concurrent offre mieux pour moins cher — juste par inertie.",
    tag: "Décision",
  },
  {
    name: "Effet de faux consensus",
    short: "On surestime à quel point les autres pensent comme nous.",
    example:
      "Être convaincu que « tout le monde » est d'accord avec son avis politique, simplement parce que ses amis proches le partagent.",
    tag: "Social",
  },
  {
    name: "Biais d'autocomplaisance",
    short: "On s'attribue les succès, on attribue les échecs aux circonstances.",
    example: "Une bonne note : « j'ai bien révisé ». Une mauvaise note : « le prof était injuste ».",
    tag: "Ego",
  },
  {
    name: "Biais de cadrage",
    short: "La façon dont une info est présentée change notre décision, même si le fond est identique.",
    example:
      "« 90 % de réussite » convainc plus qu'« 10 % d'échec » — pourtant c'est exactement la même statistique.",
    tag: "Communication",
  },
  {
    name: "Effet Barnum",
    short: "On trouve très personnelle une description en réalité vague et applicable à tout le monde.",
    example:
      "Un horoscope du type « vous avez besoin d'être apprécié mais savez aussi être critique envers vous-même » — vrai pour à peu près n'importe qui.",
    tag: "Croyances",
  },
  {
    name: "Biais de groupe (ingroup bias)",
    short: "On favorise naturellement les membres de son propre groupe.",
    example:
      "Juger plus sévèrement une faute commise par un supporter d'une équipe rivale que la même faute commise par un joueur de son propre club.",
    tag: "Social",
  },
  {
    name: "Biais de récence",
    short: "On donne plus de poids aux informations les plus récentes qu'aux anciennes.",
    example: "Juger la performance annuelle d'un collègue surtout sur son dernier mois, en oubliant les onze précédents.",
    tag: "Mémoire",
  },
  {
    name: "Paradoxe du choix",
    short: "Trop d'options rendent la décision plus difficile, pas plus facile.",
    example:
      "Face à 40 sortes de confiture en rayon, on hésite plus longtemps — et on est souvent moins satisfait de son choix final — que face à 6 sortes seulement.",
    tag: "Décision",
  },
  {
    name: "Biais de projection",
    short: "On suppose que les autres pensent et ressentent comme nous.",
    example: "Offrir un cadeau qu'on aimerait soi-même recevoir, sans se demander si la personne en face a les mêmes goûts.",
    tag: "Social",
  },
];

function dayIndexFor(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export default function App() {
  const today = useMemo(() => new Date(), []);
  const todayIndex = dayIndexFor(today) % BIASES.length;
  const [offset, setOffset] = useState(0);

  const index = (((todayIndex + offset) % BIASES.length) + BIASES.length) % BIASES.length;
  const bias = BIASES[index];
  const isToday = offset === 0;
  const isLocked = offset < 0;

  const dateLabel = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  }, [offset, today]);

  return (
    <div className="min-h-screen w-full bg-[#1c1b29] text-[#f3f1ec] flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-[#8b87a8]">
            <Brain size={18} strokeWidth={1.5} />
            <span className="text-sm tracking-wide uppercase">Un biais par jour</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#8b87a8]">
            <Calendar size={14} strokeWidth={1.5} />
            <span className="capitalize">{dateLabel}</span>
          </div>
        </div>

        <div className="relative bg-[#252336] rounded-2xl p-7 border border-[#36334a] shadow-2xl min-h-[420px] flex flex-col">
          {isLocked && (
            <div className="absolute inset-0 bg-[#1c1b29]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3 z-10">
              <Lock size={28} className="text-[#d4a857]" strokeWidth={1.5} />
              <p className="text-sm text-[#8b87a8] text-center px-8">
                Les biais des jours précédents sont réservés à la version complète.
              </p>
            </div>
          )}

          <span className="self-start text-[11px] tracking-wider uppercase text-[#d4a857] bg-[#d4a857]/10 px-2.5 py-1 rounded-full mb-5">
            {bias.tag}
          </span>

          <h1 className="font-display text-3xl leading-tight mb-4">{bias.name}</h1>

          <p className="text-[#c9c6dc] text-base leading-relaxed mb-6">{bias.short}</p>

          <div className="mt-auto pt-5 border-t border-[#36334a]">
            <p className="text-[11px] uppercase tracking-wider text-[#8b87a8] mb-2">Exemple concret</p>
            <p className="text-[#e8e6f0] text-sm leading-relaxed italic">{bias.example}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setOffset((o) => o - 1)}
            className="flex items-center gap-1 text-sm text-[#8b87a8] hover:text-[#f3f1ec] transition-colors py-2 px-3 rounded-lg hover:bg-[#252336]"
          >
            <ChevronLeft size={16} />
            Hier
          </button>

          {!isToday && (
            <button onClick={() => setOffset(0)} className="text-xs text-[#d4a857] hover:underline">
              Revenir à aujourd'hui
            </button>
          )}

          <button
            onClick={() => setOffset((o) => o + 1)}
            className="flex items-center gap-1 text-sm text-[#8b87a8] hover:text-[#f3f1ec] transition-colors py-2 px-3 rounded-lg hover:bg-[#252336]"
          >
            Demain
            <ChevronRight size={16} />
          </button>
        </div>

        <p className="text-center text-[11px] text-[#5e5b78] mt-8">
          {BIASES.length} biais en base · format carte quotidienne
        </p>
      </div>
    </div>
  );
}
