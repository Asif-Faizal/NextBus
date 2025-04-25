// data/models/bus_model.dart

import '../domain/bus_entity.dart';

class BusModel extends BusEntity {
  const BusModel({
    required super.id,
    required super.busName,
    required super.busNumberPlate,
    required super.busOwnerName,
    required super.busType,
    required super.busSubType,
    required super.driverName,
    required super.conductorName,
  });

  factory BusModel.fromJson(Map<String, dynamic> json) => BusModel(
        id: json['_id'],
        busName: json['busName'],
        busNumberPlate: json['busNumberPlate'],
        busOwnerName: json['busOwnerName'],
        busType: json['busType'],
        busSubType: json['busSubType'],
        driverName: json['driverName'],
        conductorName: json['conductorName'],
      );
}

class PaginatedBusResponse {
  final List<BusModel> data;
  final int total;
  final int page;
  final int limit;
  final int totalPages;

  PaginatedBusResponse({
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
    required this.totalPages,
  });

  factory PaginatedBusResponse.fromJson(Map<String, dynamic> json) =>
      PaginatedBusResponse(
        data: List.from(json['data']).map((e) => BusModel.fromJson(e)).toList(),
        total: json['total'],
        page: json['page'],
        limit: json['limit'],
        totalPages: json['totalPages'],
      );
}
