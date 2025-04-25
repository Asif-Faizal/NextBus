import 'package:flutter/material.dart';
import 'navigation_service.dart';

/// Extension methods on BuildContext for easy navigation
extension NavigationExtension on BuildContext {
  /// Navigate to a named route
  Future<dynamic> navigateTo(String routeName, {Object? arguments}) {
    return NavigationService().navigateTo(routeName, arguments: arguments);
  }
  
  /// Navigate to a named route and remove all previous routes
  Future<dynamic> navigateToAndRemoveUntil(String routeName, {Object? arguments}) {
    return NavigationService().navigateToAndRemoveUntil(routeName, arguments: arguments);
  }
  
  /// Navigate to a named route and replace the current route
  Future<dynamic> navigateToReplace(String routeName, {Object? arguments}) {
    return NavigationService().navigateToReplace(routeName, arguments: arguments);
  }
  
  /// Go back to the previous route
  void goBack() {
    NavigationService().goBack();
  }
  
  /// Go back to the previous route with a result
  void goBackWithResult(dynamic result) {
    NavigationService().goBackWithResult(result);
  }
  
  /// Go back to a specific route
  void goBackToRoute(String routeName) {
    NavigationService().goBackToRoute(routeName);
  }
} 