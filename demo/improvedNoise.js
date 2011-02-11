// http://mrl.nyu.edu/~perlin/noise/

var ImprovedNoise = function () {

    var p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
         23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
         174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
         133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
         89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
         202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
         248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
         178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
         14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
         93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

    for ( var i = 0; i < 256 ; i++ ) {

        p[ 256 + i ] = p[ i ];

    }

    function fade( t ) {

        return t * t * t * ( t * ( t * 6 - 15 ) + 10 );

    }

    function lerp( t, a, b ) {

        return a + t * ( b - a );

    }

    function grad( hash, x, y, z ) {

        var h = hash & 15;
        var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ( ( h & 1 ) == 0 ? u : -u ) + ( ( h & 2 ) == 0 ? v : -v );

    }

    return {

        noise: function ( x, y, z ) {

            var floorX = Math.floor( x ), floorY = Math.floor( y ), floorZ = Math.floor( z );

            var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

            x -= floorX;
            y -= floorY;
            z -= floorZ;

            var xMinus1 = x -1, yMinus1 = y - 1, zMinus1 = z - 1;

            var u = fade( x ), v = fade( y ), w = fade( z );

            var A = p[ X ] + Y, AA = p[ A ] + Z, AB = p[ A + 1 ] + Z, B = p[ X + 1 ] + Y, BA = p[ B ] + Z, BB = p[ B + 1 ] + Z;

            return lerp( w, lerp( v, lerp( u, grad( p[ AA ], x, y, z ),
                               grad( p[ BA ], xMinus1, y, z ) ),
                          lerp( u, grad( p[ AB ], x, yMinus1, z ),
                               grad( p[ BB ], xMinus1, yMinus1, z ) ) ),
                     lerp( v, lerp( u, grad( p[ AA + 1 ], x, y, zMinus1 ),
                               grad( p[ BA + 1 ], xMinus1, y, z - 1 ) ),
                          lerp( u, grad( p[ AB + 1 ], x, yMinus1, zMinus1 ),
                               grad( p[ BB + 1 ], xMinus1, yMinus1, zMinus1 ) ) ) );

        }
    }
}

var currentRandom = Math.random;

// Pseudo-random generator
function Marsaglia(i1, i2) {
  // from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
  var z=i1 || 362436069, w= i2 || 521288629;
  var nextInt = function() {
    z=(36969*(z&65535)+(z>>>16)) & 0xFFFFFFFF;
    w=(18000*(w&65535)+(w>>>16)) & 0xFFFFFFFF;
    return (((z&0xFFFF)<<16) | (w&0xFFFF)) & 0xFFFFFFFF;
  };
 
  this.nextDouble = function() {
    var i = nextInt() / 4294967296;
    return i < 0 ? 1 + i : i;
  };
  this.nextInt = nextInt;
}
Marsaglia.createRandomized = function() {
  var now = new Date();
  return new Marsaglia((now / 60000) & 0xFFFFFFFF, now & 0xFFFFFFFF);
};      

// Noise functions and helpers
function PerlinNoise(seed) {
  var rnd = seed !== undefined ? new Marsaglia(seed) : Marsaglia.createRandomized();
  var i, j;
  // http://www.noisemachine.com/talk1/17b.html
  // http://mrl.nyu.edu/~perlin/noise/
  // generate permutation
  var p = new Array(512); 
  for(i=0;i<256;++i) { p[i] = i; }
  for(i=0;i<256;++i) { var t = p[j = rnd.nextInt() & 0xFF]; p[j] = p[i]; p[i] = t; }
  // copy to avoid taking mod in p[0];
  for(i=0;i<256;++i) { p[i + 256] = p[i]; } 
  
  function grad3d(i,x,y,z) {        
    var h = i & 15; // convert into 12 gradient directions
    var u = h<8 ? x : y,                 
        v = h<4 ? y : h===12||h===14 ? x : z;
    return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
  }

  function grad2d(i,x,y) { 
    var v = (i & 1) === 0 ? x : y;
    return (i&2) === 0 ? -v : v;
  }
  
  function grad1d(i,x) { 
    return (i&1) === 0 ? -x : x;
  }
  
  function lerp(t,a,b) { return a + t * (b - a); }
    
  this.noise3d = function(x, y, z) {
    var X = Math.floor(x)&255, Y = Math.floor(y)&255, Z = Math.floor(z)&255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y, fz = (3-2*z)*z*z;
    var p0 = p[X]+Y, p00 = p[p0] + Z, p01 = p[p0 + 1] + Z, p1  = p[X + 1] + Y, p10 = p[p1] + Z, p11 = p[p1 + 1] + Z;
    return lerp(fz, 
      lerp(fy, lerp(fx, grad3d(p[p00], x, y, z), grad3d(p[p10], x-1, y, z)),
               lerp(fx, grad3d(p[p01], x, y-1, z), grad3d(p[p11], x-1, y-1,z))),
      lerp(fy, lerp(fx, grad3d(p[p00 + 1], x, y, z-1), grad3d(p[p10 + 1], x-1, y, z-1)),
               lerp(fx, grad3d(p[p01 + 1], x, y-1, z-1), grad3d(p[p11 + 1], x-1, y-1,z-1))));
  };
  
  this.noise2d = function(x, y) {
    var X = Math.floor(x)&255, Y = Math.floor(y)&255;
    x -= Math.floor(x); y -= Math.floor(y);
    var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y;
    var p0 = p[X]+Y, p1  = p[X + 1] + Y;
    return lerp(fy, 
      lerp(fx, grad2d(p[p0], x, y), grad2d(p[p1], x-1, y)),
      lerp(fx, grad2d(p[p0 + 1], x, y-1), grad2d(p[p1 + 1], x-1, y-1)));
  };

  this.noise1d = function(x) {
    var X = Math.floor(x)&255;
    x -= Math.floor(x);
    var fx = (3-2*x)*x*x;
    return lerp(fx, grad1d(p[X], x), grad1d(p[X+1], x-1));
  };
}

//  these are lifted from Processing.js
// processing defaults
var noiseProfile = { generator: undefined, octaves: 4, fallout: 0.5, seed: undefined};

function noise(x, y, z) {
  if(noiseProfile.generator === undefined) {
    // caching
    noiseProfile.generator = new PerlinNoise(noiseProfile.seed);
  }
  var generator = noiseProfile.generator;
  var effect = 1, k = 1, sum = 0;
  for(var i=0; i<noiseProfile.octaves; ++i) {
    effect *= noiseProfile.fallout;        
    switch (arguments.length) {
    case 1:
      sum += effect * (1 + generator.noise1d(k*x))/2; break;
    case 2:
      sum += effect * (1 + generator.noise2d(k*x, k*y))/2; break;
    case 3:
      sum += effect * (1 + generator.noise3d(k*x, k*y, k*z))/2; break;
    }
    k *= 2;
  }
  return sum;
};