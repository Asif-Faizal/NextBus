import 'package:equatable/equatable.dart';

class AddBusModel extends Equatable {
  final String busName;
  final String busNumberPlate;
  final String busOwnerName;
  final String busType;
  final String busSubType;
  final String driverName;
  final String conductorName;

  const AddBusModel({
    required this.busName,
    required this.busNumberPlate,
    required this.busOwnerName,
    required this.busType,
    required this.busSubType,
    required this.driverName,
    required this.conductorName,
  });

  @override
  List<Object?> get props => [busName, busNumberPlate, busOwnerName, busType, busSubType, driverName, conductorName];

  Map<String, dynamic> toJson() => {
    'busName': busName,
    'busNumberPlate': busNumberPlate,
    'busOwnerName': busOwnerName,
    'busType': busType,
    'busSubType': busSubType,
    'driverName': driverName,
    'conductorName': conductorName,
  };
}
