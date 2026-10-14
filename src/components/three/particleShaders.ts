export const particleVertexShader = `
  attribute vec3 targetPosition;
  attribute float seed;
  attribute float elevation;
  attribute float targetElevation;
  uniform float uTime;
  uniform float uMorph;
  uniform float uGraph;
  uniform float uPixelRatio;
  uniform vec2 uPointer;
  uniform float uHover;
  uniform float uDark;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float blend = smoothstep(0.0, 1.0, uMorph);
    vec3 p = mix(position, targetPosition, blend);
    float phase = seed * 6.28318;
    float amplitude = mix(0.065, 0.038, uGraph);
    p += vec3(sin(uTime*.72+phase+p.y), cos(uTime*.57+phase+p.z), sin(uTime*.61+phase+p.x)) * amplitude;
    float rotation = uTime * .09 * (1.0-uGraph);
    p.xz = mat2(cos(rotation),-sin(rotation),sin(rotation),cos(rotation))*p.xz;
    vec2 away = p.xy-uPointer;
    float distanceToMouse = length(away);
    float influence = exp(-distanceToMouse*distanceToMouse*2.8)*uHover;
    p.xy += (away/(distanceToMouse+.08)) * influence * .48;
    p.z += influence*.32;
    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = (2.1+seed*2.0) * uPixelRatio * (1.0+influence*.45);
    vec3 forest = vec3(.025,.16,.075);
    vec3 emerald = vec3(.035,.38,.15);
    vec3 sage = vec3(.28,.47,.19);
    vec3 mint = vec3(.24,.62,.39);
    vec3 lightColor = seed < .25 ? forest : seed < .5 ? emerald : seed < .75 ? sage : mint;
    vec3 darkColor = seed > .83 ? vec3(.38,.67,.29) : mix(vec3(.28,.34,.30),vec3(.94,.96,.93),seed/.83);
    float height = mix(elevation,targetElevation,blend);
    vec3 mapColor = height < .5 ? mix(forest,emerald,height*2.0)
      : height < .75 ? mix(emerald,sage,(height-.5)*4.0)
      : mix(sage,vec3(.94,.78,.035),(height-.75)*4.0);
    vColor = mix(mix(lightColor,darkColor,uDark),mapColor,uGraph);
    vAlpha = mix(.62,.96,seed) * (0.72+0.28*smoothstep(-1.9,1.9,p.z));

  }
`;
export const particleFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float distanceToCenter = length(gl_PointCoord-.5);
    if(distanceToCenter>.5) discard;
    float opacity = 1.0-smoothstep(.25,.5,distanceToCenter);
    gl_FragColor = vec4(vColor,opacity*vAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const surfaceVertexShader = `
  attribute vec3 targetPosition;
  uniform float uMorph;
  uniform float uTime;
  void main() {
    vec3 p = mix(position,targetPosition,smoothstep(0.0,1.0,uMorph));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
  }
`;
export const surfaceFragmentShader = `
  uniform float uOpacity;
  uniform vec3 uColor;
  void main() {
    gl_FragColor=vec4(uColor,uOpacity);
    #include <colorspace_fragment>
  }
`;
