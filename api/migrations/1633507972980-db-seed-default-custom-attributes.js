const { DB, COLLECTION } = require('./lib');

const GROUP = [];
const DATA = {
  gender: [
    {
      key: 'male',
      value: 'Male'
    },
    {
      key: 'female',
      value: 'Female'
    }
  ],
  eyes: [
    {
      key: 'blue',
      value: 'Blue'
    },
    {
      key: 'black',
      value: 'Black'
    },
    {
      key: 'grey',
      value: 'Grey'
    },
    {
      key: 'brown',
      value: 'Brown'
    },
    {
      key: 'hazel',
      value: 'Hazel'
    },
    {
      key: 'amber',
      value: 'Amber'
    }
  ],
  hairColor: [
    {
      key: 'blonde',
      value: 'Blonde'
    },
    {
      key: 'black',
      value: 'Black'
    },
    {
      key: 'white',
      value: 'White'
    },
    {
      key: 'brown',
      value: 'Brown'
    },
    {
      key: 'other',
      value: 'Other'
    }
  ],
  hairLength: [
    {
      key: 'buzzCut',
      value: 'Buzz Cut'
    },
    {
      key: 'short',
      value: 'Short'
    },
    {
      key: 'long',
      value: 'Long'
    }
  ],
  bustSize: [
    {
      key: 'A',
      value: 'A'
    },
    {
      key: 'B',
      value: 'B'
    },
    {
      key: 'C',
      value: 'C'
    },
    {
      key: 'D',
      value: 'D'
    },
    {
      key: 'DD',
      value: 'DD'
    },
    {
      key: 'F',
      value: 'F'
    },
    {
      key: 'FF',
      value: 'FF'
    },
    {
      key: 'G',
      value: ''
    }
  ],
  bustType: [
    {
      key: 'natural',
      value: 'Natural'
    },
    {
      key: 'plastic',
      value: 'Plastic'
    }
  ],
  travel: [
    {
      key: 'worldwide',
      value: 'Worldwide'
    },
    {
      key: 'no',
      value: 'No'
    }
  ],
  weight: [
    {
      key: '<40kb',
      value: '< 40 kg (88.18 lb)'
    },
    {
      key: '41-45kg',
      value: '41-45 kg (90.39-99.21 lb)'
    },
    {
      key: '46-50kg',
      value: '46-50 kg (101.41-110.23 lb)'
    },
    {
      key: '51-55kg',
      value: '51-55 kg (112.44-121.25 lb)'
    },
    {
      key: '56-60kg',
      value: '56-60 kg (123.46-132.28 lb)'
    },
    {
      key: '61-65kg',
      value: '61-65 kg (134.48-143.3 lb)'
    },
    {
      key: '66-70kg',
      value: '66-70 kg (145.5-154.32 lb)'
    },
    {
      key: '71-75kg',
      value: '71-75 kg (156.53-165.35 lb)'
    },
    {
      key: '>75kg',
      value: '> 75 kg (165.35 lb)'
    }
  ],
  height: [
    {
      key: '<160cm',
      value: '< 160 cm (5\'3" ft)'
    },
    {
      key: '160-165cm',
      value: '160-165 cm (5\'3"-5\'5" ft)'
    },
    {
      key: '166-170cm',
      value: '166-170 cm (5\'5"-5\'7" ft)'
    },
    {
      key: '171-175cm',
      value: '171-175 cm (5\'7"-5\'9" ft)'
    },
    {
      key: '176-180cm',
      value: '176-180 cm (5\'9"-5\'11" ft)'
    },
    {
      key: '181-185cm',
      value: '181-185 cm (5\'11"-6\'1" ft)'
    },
    {
      key: '>185cm',
      value: '> 185 cm (6\'1" ft)'
    }
  ],
  ethnicity: [
    {
      key: 'arab',
      value: 'Arab'
    },
    {
      key: 'Asian',
      value: 'Asian'
    },
    {
      key: 'ebony',
      value: 'Ebony (Black)'
    },
    {
      key: 'european',
      value: 'European (white)'
    },
    {
      key: 'indian',
      value: 'Indian'
    },
    {
      key: 'latin',
      value: 'Latin'
    },
    {
      key: 'mixed',
      value: 'Mixed'
    }
  ],
  orientation: [
    {
      key: 'heterosexual',
      value: 'Heterosexual'
    },
    {
      key: 'homosexual',
      value: 'Homosexual'
    },
    {
      key: 'asexual',
      value: 'Asexual'
    },
    {
      key: 'bisexual',
      value: 'Bisexual'
    }
  ],
  service: [
    {
      key: '69',
      value: '69 position'
    },
    {
      key: 'bondage',
      value: 'Bondage'
    },
    {
      key: 'classicSex',
      value: 'Classic sex'
    },
    {
      key: 'cumOnBody',
      value: 'Cum on body'
    },
    {
      key: 'deepthroat',
      value: 'Deepthroat'
    },
    {
      key: 'dirtyTalk',
      value: 'Dirty talk'
    },
    {
      key: 'eroticMassage',
      value: 'Erotic massage'
    },
    {
      key: 'footFetish',
      value: 'Foot fetish'
    },
    {
      key: 'frenchKissing',
      value: 'French kissing'
    },
    {
      key: 'handjob',
      value: 'Handjob'
    },
    {
      key: 'kamasutra',
      value: 'Kamasutra'
    },
    {
      key: 'masturbation',
      value: 'Masturbation'
    },
    {
      key: 'role-play',
      value: 'Role-play'
    },
    {
      key: 'sexBetweenBreasts',
      value: 'Sex between breasts'
    },
    {
      key: 'sexToys',
      value: 'Sex Toys'
    },
    {
      key: 'striptease',
      value: 'Striptease'
    },
    {
      key: 'anal',
      value: 'Anal'
    },
    {
      key: 'couples',
      value: 'Couples'
    },
    {
      key: 'cumInFace',
      value: 'Cum in face'
    },
    {
      key: 'cumInMouth',
      value: 'Cum in mouth'
    },
    {
      key: 'domination',
      value: 'Domination'
    },
    {
      key: 'duoWithGirl',
      value: 'Duo with girl'
    },
    {
      key: 'GFE',
      value: 'GFE'
    },
    {
      key: 'goldenShowerGive',
      value: 'Golden shower give'
    },
    {
      key: 'groupSex',
      value: 'Group sex'
    },
    {
      key: 'oralWithoutCondom',
      value: 'Oral without condom'
    },
    {
      key: 'rimmingPassive',
      value: 'Rimming Passive'
    },
    {
      key: 'with2Men',
      value: 'With 2 men'
    }
  ],
  provide: [
    { key: 'outcall', value: 'Outcall' },
    { key: 'incall', value: 'Incall' }
  ],
  meetingWith: [
    {
      key: 'availableForMen',
      value: 'Available for men'
    },
    {
      key: 'availableForWomen',
      value: 'Available for women'
    },
    {
      key: 'availableForCouples',
      value: 'Available for couples'
    },
    {
      key: 'availableForTranssexuals',
      value: 'Available for transsexuals'
    },
    {
      key: 'availableForGays',
      value: 'Available for gays'
    },
    {
      key: '2+',
      value: '2+'
    }
  ],
  smoker: [
    {
      key: 'yes',
      value: 'Yes'
    },
    {
      key: 'no',
      value: 'No'
    }
  ],
  tattoo: [
    {
      key: 'yes',
      value: 'Yes'
    },
    {
      key: 'no',
      value: 'No'
    }
  ],
  time: [
    {
      key: '1h',
      value: '1 Hour'
    },
    {
      key: '2h',
      value: '2 Hours'
    },
    {
      key: '3h',
      value: '3 Hours'
    },
    {
      key: '6h',
      value: '6 Hours'
    },
    {
      key: '12h',
      value: '12 Hours'
    }
  ],
  currency: [
    {
      key: 'usd',
      value: '$'
    },
    {
      key: 'eur',
      value: '€'
    }
  ]
};

Object.entries(DATA).forEach(([group]) => {
  GROUP.push(group);
});

module.exports.up = async function up(next) {
  const insertData = async (group) => DATA[group].reduce(async (oldPromise, val) => {
    await oldPromise;

    const exists = await DB.collection(COLLECTION.CUSTOM_ATTRIBUTE).findOne({
      group,
      key: val.key
    });
    if (!exists) {
      await DB.collection(COLLECTION.CUSTOM_ATTRIBUTE).insertOne({
        group,
        ...val
      });
    }
  }, Promise.resolve());

  // eslint-disable-next-line no-restricted-syntax
  for (const group of GROUP) {
    // eslint-disable-next-line no-await-in-loop
    await insertData(group);
  }

  next();
};

module.exports.down = function down(next) {
  next();
};
