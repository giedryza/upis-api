import { Document, PaginateModel, Types } from 'mongoose';

import {
  AppFile,
  Currency,
  EntityId,
  Language,
  PriceRecord,
  WithTimestamp,
} from 'types/common';

export const regions = [
  'aukstaitija',
  'dzukija',
  'mazoji-lietuva',
  'suvalkija',
  'zemaitija',
] as const;

export const rivers = [
  'agluona_minija',
  'agluona_sesuvis',
  'agluona_vadakstis',
  'aiseta',
  'aiste',
  'aitra',
  'akmena',
  'aknysta',
  'alantas',
  'almaja',
  'alna',
  'alove',
  'alsia',
  'ancia',
  'anyksta',
  'antvarde',
  'apascia',
  'apse',
  'armone',
  'aseka',
  'asva_vadakstis',
  'asva_veivirzas',
  'aunuva',
  'babrungas',
  'baltoji_ancia',
  'bartuva',
  'barupe',
  'bebirva',
  'berze',
  'birveta',
  'blendziava',
  'brazuole',
  'buka',
  'dabikine',
  'dane',
  'darba',
  'daugyvene',
  'dysna',
  'dotnuvele',
  'dovine',
  'dringykscia',
  'druksa',
  'dubinga',
  'dubysa',
  'duksta',
  'ekete',
  'erla',
  'ezeruona',
  'ganse',
  'gauja',
  'gege',
  'gyneve',
  'graumena',
  'gryzuva',
  'gruda',
  'indraja',
  'jara',
  'jiesia',
  'jotija',
  'juoda',
  'juosta',
  'jura',
  'kamoja',
  'kamona',
  'kena',
  'kertusa',
  'kiauna',
  'kirksnove',
  'kirsna',
  'kirsinas',
  'klaipedos_kanalas',
  'krazante',
  'kretuona',
  'kriauna',
  'kruoja',
  'kupa',
  'kviste',
  'lakaja',
  'lankesa',
  'lapainia',
  'lapise',
  'laukesa',
  'laukysta',
  'leite',
  'letausas',
  'levuo',
  'liaude',
  'ligaja',
  'linkava',
  'lokys',
  'lokysta',
  'lomena',
  'lukna',
  'lukne',
  'luoba',
  'lusis',
  'mera_kuna',
  'merkys',
  'mincia',
  'minija',
  'misupe',
  'mituva',
  'muse',
  'musa',
  'musia',
  'nedzingis',
  'nemunas',
  'nemunelis',
  'neris',
  'neveza',
  'nevezis',
  'nieda',
  'nova',
  'obelis',
  'pala',
  'patekla',
  'pelysa',
  'perseke',
  'persoksna',
  'pilve',
  'pisa',
  'pyvesa',
  'plastaka',
  'ratnycia',
  'rauda',
  'rausve',
  'resketa',
  'riese',
  'ringuva',
  'rominta',
  'roveja',
  'rudamina',
  'saide',
  'salantas',
  'sanziles_kanalas',
  'saria',
  'sausdravas',
  'seira',
  'siesartis_sesupe',
  'siesartis_sventoji',
  'skroblus',
  'smelte',
  'smilga',
  'spengla_dubinga',
  'spengla_merkys',
  'srove',
  'sruoja',
  'stirne',
  'strauja',
  'streva',
  'svyla',
  'salcia',
  'salpe',
  'saltuona',
  'sasuola',
  'sata',
  'seimena',
  'selmenta',
  'serksne',
  'sesupe',
  'sesuva',
  'sesuvis',
  'siause',
  'simsa',
  'sirvinta_sesupe',
  'sirvinta_sventoji',
  'sysa',
  'sunija',
  'suoja',
  'sustis',
  'susve',
  'sventoji',
  'sventoji_pajurio',
  'svete',
  'svogina',
  'tatula',
  'tenenys',
  'tramis',
  'upe',
  'upita',
  'upyte',
  'ula',
  'vadakstis',
  'varduva',
  'varene',
  'veivirzas',
  'venta',
  'verkne',
  'verseka',
  'vidauja',
  'viesete',
  'viesinta',
  'viesvile',
  'vilka',
  'vilnele',
  'virinta',
  'virvycia',
  'visincia',
  'visakis',
  'vizaina',
  'vyzuona_nemunelis',
  'vyzuona_sventoji',
  'voke',
  'yzne',
  'zanyla',
  'zapse',
  'zembre',
  'zeimena',
  'zizma',
  'zvelsa',
] as const;

export const amenityVariants = [
  'transport',
  'child-seat',
  'life-vest',
  'phone-case',
  'dry-bag',
  'tent',
  'sleeping-bag',
  'grill',
  'guide',
  'camera',
  'pet-friendly',
] as const;

export const boats = ['single-kayak', 'double-kayak', 'triple-kayak'] as const;

export const units = ['tour', 'day', 'h', 'km'] as const;

export type Region = typeof regions[number];

export type River = typeof rivers[number];

export type AmenityVariant = typeof amenityVariants[number];

export type Boat = typeof boats[number];

export type Unit = typeof units[number];

export interface AmenityRecord {
  variant: AmenityVariant;
  price: number;
  currency: Currency;
  unit: Unit;
  info: string;
}

export interface AmenityDocument extends AmenityRecord, Types.Subdocument {}

export interface TourRecord extends WithTimestamp {
  name: string;
  slug: string;
  description: string;
  website: string;
  departure: string;
  arrival: string;
  distance: number | null;
  duration: number | null;
  days: number;
  difficulty: number;
  price: PriceRecord | null;
  rivers: string[];
  regions: Region[];
  photos: AppFile[];
  amenities: AmenityRecord[];
  boats: Boat[];
  languages: Language[];
  company: EntityId;
  user: EntityId;
}

export interface TourDocument extends TourRecord, Document {}

export interface TourModel extends PaginateModel<TourDocument> {}
