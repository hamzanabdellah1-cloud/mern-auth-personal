import { useEffect, useRef } from 'react'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

function AnimatedScene({ className = '', compact = false }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current

    if (!container || !canvas) {
      return undefined
    }

    let isMounted = true
    let cleanupScene = () => {}

    import('three').then(
      ({
        AmbientLight,
        BoxGeometry,
        DirectionalLight,
        EdgesGeometry,
        Group,
        IcosahedronGeometry,
        InstancedMesh,
        LineBasicMaterial,
        LineSegments,
        Mesh,
        MeshStandardMaterial,
        Object3D,
        PerspectiveCamera,
        PointLight,
        Scene,
        SRGBColorSpace,
        TorusGeometry,
        WebGLRenderer,
      }) => {
        if (!isMounted) {
          return
        }

        const renderer = new WebGLRenderer({
          canvas,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.outputColorSpace = SRGBColorSpace

        const scene = new Scene()
        const camera = new PerspectiveCamera(42, 1, 0.1, 100)
        camera.position.set(0, 0, compact ? 6 : 7.5)

        const group = new Group()
        scene.add(group)

        const coreGeometry = new IcosahedronGeometry(compact ? 1.15 : 1.6, 2)
        const coreMaterial = new MeshStandardMaterial({
          color: '#4de0d4',
          metalness: 0.42,
          opacity: 0.92,
          roughness: 0.28,
          transparent: true,
        })
        const core = new Mesh(coreGeometry, coreMaterial)
        group.add(core)

        const edgeGeometry = new EdgesGeometry(coreGeometry)
        const edgeMaterial = new LineBasicMaterial({
          color: '#ecfeff',
          opacity: 0.45,
          transparent: true,
        })
        const edges = new LineSegments(edgeGeometry, edgeMaterial)
        group.add(edges)

        const ringMaterial = new MeshStandardMaterial({
          color: '#f7cf69',
          metalness: 0.35,
          opacity: 0.75,
          roughness: 0.38,
          transparent: true,
        })
        const rings = [
          new Mesh(
            new TorusGeometry(compact ? 1.7 : 2.35, 0.018, 16, 120),
            ringMaterial,
          ),
          new Mesh(
            new TorusGeometry(compact ? 2.05 : 2.85, 0.014, 16, 120),
            ringMaterial,
          ),
        ]

        rings[0].rotation.set(1.22, 0.35, 0.2)
        rings[1].rotation.set(0.45, 1.22, -0.35)
        rings.forEach((ring) => group.add(ring))

        const nodeCount = compact ? 30 : 48
        const nodeGeometry = new BoxGeometry(0.055, 0.055, 0.055)
        const nodeMaterial = new MeshStandardMaterial({
          color: '#3157d5',
          emissive: '#0b1f63',
          emissiveIntensity: 0.28,
          roughness: 0.45,
        })
        const nodes = new InstancedMesh(
          nodeGeometry,
          nodeMaterial,
          nodeCount,
        )
        const dummy = new Object3D()
        const fieldRadius = compact ? 2.45 : 3.35

        for (let index = 0; index < nodeCount; index += 1) {
          const angle = (index / nodeCount) * Math.PI * 2
          const height = Math.sin(index * 1.37) * (compact ? 1.45 : 2.1)

          dummy.position.set(
            Math.cos(angle) * fieldRadius,
            height,
            Math.sin(angle) * fieldRadius * 0.58,
          )
          dummy.rotation.set(angle, angle * 0.5, angle * 0.25)
          dummy.scale.setScalar(0.75 + (index % 4) * 0.18)
          dummy.updateMatrix()
          nodes.setMatrixAt(index, dummy.matrix)
        }

        nodes.instanceMatrix.needsUpdate = true
        group.add(nodes)

        scene.add(new AmbientLight('#ffffff', 0.85))

        const keyLight = new DirectionalLight('#ffffff', 2.2)
        keyLight.position.set(3.5, 4, 5)
        scene.add(keyLight)

        const accentLight = new PointLight('#f7cf69', 2.6, 12)
        accentLight.position.set(-3.4, -2.2, 3.2)
        scene.add(accentLight)

        const pointer = {
          x: 0,
          y: 0,
        }
        const startTime = performance.now()
        let frameId = 0

        const resize = () => {
          const width = Math.max(container.clientWidth, 1)
          const height = Math.max(container.clientHeight, 1)

          renderer.setSize(width, height, false)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
        }

        const renderScene = () => {
          const elapsedTime = (performance.now() - startTime) / 1000
          const motionSpeed = prefersReducedMotion ? 0 : elapsedTime

          group.rotation.x =
            Math.sin(motionSpeed * 0.32) * 0.15 + pointer.y * 0.12
          group.rotation.y = motionSpeed * 0.2 + pointer.x * 0.16
          core.rotation.y = motionSpeed * 0.38
          core.rotation.z = motionSpeed * 0.18
          edges.rotation.copy(core.rotation)
          rings[0].rotation.z = motionSpeed * 0.16
          rings[1].rotation.x = 0.45 + motionSpeed * 0.12

          renderer.render(scene, camera)
        }

        const animate = () => {
          renderScene()
          frameId = window.requestAnimationFrame(animate)
        }

        const handlePointerMove = (event) => {
          pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
          pointer.y = (event.clientY / window.innerHeight - 0.5) * -2
        }

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(container)
        window.addEventListener('pointermove', handlePointerMove)
        resize()

        if (prefersReducedMotion) {
          group.rotation.set(-0.1, 0.35, 0)
          renderScene()
        } else {
          animate()
        }

        cleanupScene = () => {
          window.cancelAnimationFrame(frameId)
          window.removeEventListener('pointermove', handlePointerMove)
          resizeObserver.disconnect()

          coreGeometry.dispose()
          coreMaterial.dispose()
          edgeGeometry.dispose()
          edgeMaterial.dispose()
          rings.forEach((ring) => ring.geometry.dispose())
          ringMaterial.dispose()
          nodeGeometry.dispose()
          nodeMaterial.dispose()
          renderer.dispose()
        }
      },
    )

    return () => {
      isMounted = false
      cleanupScene()
    }
  }, [compact, prefersReducedMotion])

  return (
    <div className={`scene3d ${className}`} ref={containerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default AnimatedScene
