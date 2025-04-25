// domain/entities/bus_entity.dart
import 'package:equatable/equatable.dart';

class BusEntity extends Equatable {
  final String id;
  final String busName;
  final String busNumberPlate;
  final int status;
  final String busOwnerName;
  final String busType;
  final String busSubType;
  final String driverName;
  final String conductorName;

  const BusEntity({
    required this.id,
    required this.busName,
    required this.busNumberPlate,
    required this.status,
    required this.busOwnerName,
    required this.busType,
    required this.busSubType,
    required this.driverName,
    required this.conductorName,
  });

  @override
  List<Object?> get props => [id, busName, busNumberPlate, status];
}
