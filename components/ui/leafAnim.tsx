// import "./leafanim.css";
import { motion, MotionValue, useTransform } from "framer-motion";

interface LeafAnimProps {
  scrollProgress: MotionValue<number>;
}

export function LeafAnim({ scrollProgress }: LeafAnimProps) {
  const leaftop = "#2C5E0B";
  const leafbtm = "#3A7F0D";
  const stem = "#013300";

  const stemDraw = useTransform(scrollProgress, [0.05, 0.5], [0, 1]);

  // Leaves sprout (scale from 0 to 1) progressively as the scroll moves down
  const leaf4Scale = useTransform(scrollProgress, [0.1, 0.3], [0, 1]);
  const leaf5Scale = useTransform(scrollProgress, [0.14, 0.34], [0, 1]);
  const leaf6Scale = useTransform(scrollProgress, [0.18, 0.38], [0, 1]);
  const leaf7Scale = useTransform(scrollProgress, [0.22, 0.42], [0, 1]);
  const leaf8Scale = useTransform(scrollProgress, [0.26, 0.46], [0, 1]);
  const leaf9Scale = useTransform(scrollProgress, [0.3, 0.5], [0, 1]);

  return (
    <svg
      width="17350"
      height="6595"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 17350 6595"
      fill="none"
      className={`w-full h-auto max-h-full mt-50`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Group_1">
        <motion.path
          id="Vector_1"
          transform="translate(0 1925)"
          d="M0 836.964C444.465 636.082 2977.23 -366.211 4685.23 142.331C7350.51 935.895 7814.07 2651.11 9966.54 2995.94C12657.6 3427.05 15488.4 2440.68 17243 1468.97"
          stroke={stem}
          strokeWidth="213"
          strokeLinecap="round"
          strokeDasharray="0.0001 1"
          style={{ pathLength: stemDraw }}
        />
        <>
          {/* Vector 4 */}
          <motion.g
            id="Vector_4"
            style={{
              scale: leaf4Scale,
              transformOrigin: "bottom",
              x: 4691.66,
              y: 0,
              rotate: -0.62,
            }}
          >
            <path
              id="Vector_4_bg_0"
              d="M1338.69 531.5C1568.12 1211 1431.74 2024.27 317.967 1896C903.58 1553.41 1202.13 1331.03 1338.69 531.5Z"
              fill={leaftop}
              fillOpacity={1}
            />
            <path
              d="M863.466 833.496C438.633 1025.3 320.301 1616 317.967 1896C903.58 1553.41 1202.13 1331.03 1338.69 531.5C1272.11 334.306 1174.72 148.378 1061.46 0C1203.96 854 -519.035 479 158.467 1813C206.965 1299 491.965 916.5 863.466 833.496Z"
              fill={leafbtm}
              fillOpacity={1}
            />
          </motion.g>

          {/* Vector 6 */}
          <motion.g
            id="Vector_6"
            style={{
              scale: leaf6Scale,
              transformOrigin: "bottom",
              x: 9287.89,
              y: 3006,
              rotate: -0.62,
            }}
          >
            <path
              id="Vector_6_bg_0"
              d="M1094.39 434.506C1281.96 990.001 1170.46 1654.86 259.941 1549.99C738.685 1269.93 982.75 1088.13 1094.39 434.506Z"
              fill={leaftop}
              fillOpacity={1}
            />
            <path
              d="M705.891 681.39C358.586 838.192 261.849 1321.09 259.941 1549.99C738.685 1269.93 982.75 1088.13 1094.39 434.506C1039.96 273.298 960.342 121.301 867.757 0C984.252 698.153 -424.316 391.587 129.548 1482.14C169.196 1061.94 402.185 749.247 705.891 681.39Z"
              fill={leafbtm}
              fillOpacity={1}
            />
          </motion.g>

          {/* Vector 9 */}
          <motion.g
            id="Vector_9"
            style={{
              scale: leaf9Scale,
              transformOrigin: "bottom",
              x: 14567,
              y: 2900,
              rotate: -51.362,
            }}
          >
            <path
              id="Vector_9_bg_0"
              d="M821.373 326.109C962.145 743.025 878.465 1242.02 195.093 1163.32C554.404 953.117 737.582 816.671 821.373 326.109Z"
              fill={leaftop}
              fillOpacity={1}
            />
            <path
              d="M529.792 511.403C269.129 629.088 196.525 991.517 195.093 1163.32C554.404 953.117 737.582 816.671 821.373 326.109C780.52 205.118 720.764 91.0396 651.277 0C738.709 523.984 -318.461 293.897 97.2296 1112.39C126.986 797.02 301.852 562.332 529.792 511.403Z"
              fill={leafbtm}
              fillOpacity={1}
            />
          </motion.g>

          {/* Vector 5 */}
          <motion.g
            id="Vector_5"
            style={{
              scale: leaf5Scale,
              transformOrigin: "top",
              x: 4670.62,
              y: 3000,
              rotate: 170.729,
            }}
          >
            <path
              id="Vector_5_bg_0"
              d="M1338.69 531.5C1568.12 1211 1431.74 2024.27 317.967 1896C903.58 1553.41 1202.13 1331.03 1338.69 531.5Z"
              fill={leaftop}
              fillOpacity={1}
            />
            <path
              d="M863.466 833.496C438.633 1025.3 320.301 1616 317.967 1896C903.58 1553.41 1202.13 1331.03 1338.69 531.5C1272.11 334.306 1174.72 148.378 1061.46 0C1203.96 854 -519.035 479 158.467 1813C206.965 1299 491.965 916.5 863.466 833.496Z"
              fill={leafbtm}
              fillOpacity={1}
            />
          </motion.g>

          {/* Vector 7 */}
          <motion.g
            id="Vector_7"
            style={{
              scale: leaf7Scale,
              transformOrigin: "top",
              x: 9208.55,
              y: 5200,
              rotate: -179.38,
            }}
          >
            <path
              id="Vector_7_bg_0"
              d="M1101.63 437.378C1290.43 996.545 1178.2 1665.8 261.659 1560.24C743.567 1278.32 989.245 1095.32 1101.63 437.378Z"
              fill={leaftop}
              fillOpacity={1}
            />
            <path
              d="M710.557 685.894C360.956 843.732 263.579 1329.82 261.659 1560.24C743.567 1278.32 989.245 1095.32 1101.63 437.378C1046.83 275.105 966.689 122.102 873.492 0C990.757 702.767 -427.12 394.175 130.404 1491.94C170.314 1068.96 404.844 754.199 710.557 685.894Z"
              fill={leafbtm}
              fillOpacity={1}
            />
          </motion.g>

          {/* Vector 8 */}
          <motion.g
            id="Vector_8"
            style={{
              scale: leaf8Scale,
              transformOrigin: "top",
              x: 14737,
              y: 4660,
              rotate: 125.79,
            }}
          >
            <path
              id="Vector_8_bg_0"
              d="M1101.63 437.378C1290.43 996.545 1178.2 1665.8 261.659 1560.24C743.567 1278.32 989.245 1095.32 1101.63 437.378Z"
              fill={leaftop}
              fillOpacity={1}
            />
            <path
              d="M710.557 685.894C360.956 843.732 263.579 1329.82 261.659 1560.24C743.567 1278.32 989.245 1095.32 1101.63 437.378C1046.83 275.105 966.689 122.102 873.492 0C990.757 702.767 -427.12 394.175 130.404 1491.94C170.314 1068.96 404.844 754.199 710.557 685.894Z"
              fill={leafbtm}
              fillOpacity={1}
            />
          </motion.g>
        </>
      </g>
    </svg>
  );
}
