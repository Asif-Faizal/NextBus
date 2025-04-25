import 'package:equatable/equatable.dart';

abstract class RouteArguments extends Equatable {
  const RouteArguments();

  @override
  bool get stringify => true;
}

class DashboardArguments extends RouteArguments {
  final String username;
  final String userType;
  final String userID;

  const DashboardArguments({required this.username, required this.userType, required this.userID});

  @override
  List<Object?> get props => [username, userType, userID];
}
