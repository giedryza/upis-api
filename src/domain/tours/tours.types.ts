import { Document, PaginateModel } from 'mongoose';

import { EntityId, PriceRecord, WithTimestamp } from 'types/common';
import { AmenityDocument, Variant } from 'domain/amenities/amenities.types';
import { ProviderDocument } from 'domain/providers/providers.types';
import { ImageDocument } from 'domain/images/images.types';

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
  'antvarde',
  'anyksta',
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
  'dotnuvele',
  'dovine',
  'dringykscia',
  'druksa',
  'dubinga',
  'dubysa',
  'duksta',
  'dysna',
  'ekete',
  'erla',
  'ezeruona',
  'ganse',
  'gauja',
  'gege',
  'graumena',
  'gruda',
  'gryzuva',
  'gyneve',
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
  'kirsinas',
  'kirsna',
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
  'musa',
  'muse',
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
  'plastaka',
  'pyvesa',
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
  'salcia',
  'salpe',
  'saltuona',
  'sanziles_kanalas',
  'saria',
  'sasuola',
  'sata',
  'sausdravas',
  'seimena',
  'seira',
  'selmenta',
  'serksne',
  'sesupe',
  'sesuva',
  'sesuvis',
  'siause',
  'siesartis_sesupe',
  'siesartis_sventoji',
  'simsa',
  'sirvinta_sesupe',
  'sirvinta_sventoji',
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
  'sunija',
  'suoja',
  'sustis',
  'susve',
  'sventoji',
  'sventoji_pajurio',
  'svete',
  'svogina',
  'svyla',
  'sysa',
  'tatula',
  'tenenys',
  'tramis',
  'ula',
  'upe',
  'upita',
  'upyte',
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
  'visakis',
  'visincia',
  'vizaina',
  'voke',
  'vyzuona_nemunelis',
  'vyzuona_sventoji',
  'yzne',
  'zanyla',
  'zapse',
  'zeimena',
  'zembre',
  'zizma',
  'zvelsa',
] as const;

export type Region = (typeof regions)[number];

export type River = (typeof rivers)[number];

export const queryUtils = {
  select: [
    '_id',
    'name',
    'distance',
    'days',
    'duration',
    'price',
    'departure',
    'arrival',
  ],
  populate: ['provider', 'provider.amenities', 'amenities', 'photos'],
} as const;

export interface TourRecord extends WithTimestamp {
  name: string;
  slug: string;
  description: string;
  website: string;
  departure: {
    type: 'Point';
    coordinates: [number, number];
  } | null;
  arrival: {
    type: 'Point';
    coordinates: [number, number];
  } | null;
  distance: number | null;
  duration: number | null;
  days: number;
  difficulty: number;
  price: PriceRecord | null;
  primaryPhoto: string;
  rivers: River[];
  regions: Region[];
  photos: (EntityId | ImageDocument)[];
  amenities: {
    _id: EntityId | AmenityDocument;
    variant: Variant;
  }[];
  provider: EntityId | ProviderDocument;
  user: EntityId;
  score: number;
}

export interface TourDocument extends TourRecord, Document {}

export interface TourModel extends PaginateModel<TourDocument> {}

export interface FiltersSummary {
  distance: { min: number; max: number };
  days: { min: number; max: number };
  duration: { min: number; max: number };
  difficulty: { min: number; max: number };
}
