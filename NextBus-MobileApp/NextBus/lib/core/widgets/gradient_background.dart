import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:vector_math/vector_math_64.dart' as vector_math;
import '../theme/app_theme.dart';

class GradientBackground extends StatefulWidget {
  final Widget child;
  final bool isDarkMode;

  const GradientBackground({
    super.key,
    required this.child,
    required this.isDarkMode,
  });

  @override
  State<GradientBackground> createState() => _GradientBackgroundState();
}

class _GradientBackgroundState extends State<GradientBackground> with SingleTickerProviderStateMixin {
  late AnimationController animationController;

  @override
  void initState() {
    super.initState();
    animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 20),
    )..repeat();
  }

  @override
  void dispose() {
    animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: widget.isDarkMode
              ? [
                  AppTheme.darkGradientStart,
                  AppTheme.darkGradientEnd,
                ]
              : [
                  AppTheme.lightGradientStart,
                  AppTheme.lightGradientEnd,
                ],
        ),
      ),
      child: Stack(
        children: [
          // Pattern with fade effect
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: MediaQuery.of(context).size.height,
            child: ClipRect(
              child: ShaderMask(
                shaderCallback: (Rect bounds) {
                  return LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.white,
                      Colors.white.withValues(alpha:0.8),
                      Colors.white.withValues(alpha:0.4),
                      Colors.white.withValues(alpha:0.0),
                    ],
                    stops: const [0.0, 0.3, 0.6, 0.9],
                    transform: GradientRotation(math.pi / 2),
                  ).createShader(bounds);
                },
                blendMode: BlendMode.dstIn,
                child: AnimatedBuilder(
                  animation: animationController,
                  builder: (context, child) {
                    return CustomPaint(
                      size: Size.infinite,
                      painter: NetworkPatternPainter(
                        color: widget.isDarkMode 
                            ? AppTheme.darkGradientEnd
                            : AppTheme.lightGradientEnd,
                        animationValue: animationController.value,
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
          // Main Content
          widget.child,
        ],
      ),
    );
  }
}

class NetworkPatternPainter extends CustomPainter {
  final Color color;
  final double rotationX;
  final double rotationY;
  final double rotationZ;
  final double animationValue;

  NetworkPatternPainter({
    required this.color,
    this.rotationX = 0.7,
    this.rotationY = 0.7,
    this.rotationZ = 0.3,
    this.animationValue = 0.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 10
      ..style = PaintingStyle.stroke;

    final dotPaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    const baseSpacing = 100.0;
    final centerX = size.width / 2;
    final centerY = size.height / 2;

    // Create smooth looping animation using sine waves
    final smoothRotationX = math.sin(animationValue * math.pi * 2) * 0.1;
    final smoothRotationY = math.sin(animationValue * math.pi * 2 + math.pi / 3) * 0.15;
    final smoothRotationZ = math.sin(animationValue * math.pi * 2 + math.pi / 6) * 0.05;
    
    // Create transformation matrix for 3D rotation with smooth animation
    final matrix = Matrix4.identity()
      ..rotateX(rotationX + smoothRotationX)
      ..rotateY(rotationY + smoothRotationY)
      ..rotateZ(rotationZ + smoothRotationZ);

    // Calculate number of points in each direction
    final numPointsX = (size.width / baseSpacing).ceil() + 2;
    final numPointsY = (size.height / baseSpacing).ceil() + 2;

    // Create points array with smooth animation offset
    final points = <Offset>[];
    for (int y = -numPointsY; y <= numPointsY; y++) {
      for (int x = -numPointsX; x <= numPointsX; x++) {
        // Use sine waves for smooth looping movement
        final offsetX = math.sin(animationValue * math.pi * 2 + x * 0.1) * 10;
        final offsetY = math.sin(animationValue * math.pi * 2 + y * 0.1 + math.pi / 4) * 10;
        
        final animatedX = x * baseSpacing + offsetX;
        final animatedY = y * baseSpacing + offsetY;
        
        final point = _transformPoint(
          Offset(animatedX, animatedY),
          centerX,
          centerY,
          matrix,
        );
        points.add(point);
      }
    }

    // Draw connections between points
    for (int i = 0; i < points.length; i++) {
      for (int j = i + 1; j < points.length; j++) {
        final distance = (points[i] - points[j]).distance;
        if (distance < baseSpacing * 1.5) {
          final zCoord = _getZCoordinate(
            points[i].dx - centerX,
            points[i].dy - centerY,
            centerX,
            centerY,
            matrix,
          );
          final parallaxFactor = _calculateParallaxFactor(zCoord);
          
          paint.strokeWidth = 1.0 * parallaxFactor;
          canvas.drawLine(points[i], points[j], paint);
        }
      }
    }

    // Draw dots
    for (final point in points) {
      final zCoord = _getZCoordinate(
        point.dx - centerX,
        point.dy - centerY,
        centerX,
        centerY,
        matrix,
      );
      final parallaxFactor = _calculateParallaxFactor(zCoord);
      
      canvas.drawCircle(
        point,
        2.0 * parallaxFactor,
        dotPaint,
      );
    }
  }

  double _getZCoordinate(double x, double y, double centerX, double centerY, Matrix4 matrix) {
    final vector = vector_math.Vector3(
      x - centerX,
      y - centerY,
      0,
    );
    
    final transformed = matrix.transform3(vector);
    return transformed.z;
  }

  double _calculateParallaxFactor(double zCoord) {
    const maxZ = 1000.0;
    const minZ = -1000.0;
    const minScale = 0.3;
    const maxScale = 1.5;
    
    final normalizedZ = (zCoord - minZ) / (maxZ - minZ);
    return minScale + (maxScale - minScale) * (1 - normalizedZ);
  }

  Offset _transformPoint(Offset point, double centerX, double centerY, Matrix4 matrix) {
    final vector = vector_math.Vector3(
      point.dx - centerX,
      point.dy - centerY,
      0,
    );
    
    final transformed = matrix.transform3(vector);
    
    return Offset(
      transformed.x + centerX,
      transformed.y + centerY,
    );
  }

  @override
  bool shouldRepaint(covariant NetworkPatternPainter oldDelegate) =>
      color != oldDelegate.color ||
      rotationX != oldDelegate.rotationX ||
      rotationY != oldDelegate.rotationY ||
      rotationZ != oldDelegate.rotationZ ||
      animationValue != oldDelegate.animationValue;
} 