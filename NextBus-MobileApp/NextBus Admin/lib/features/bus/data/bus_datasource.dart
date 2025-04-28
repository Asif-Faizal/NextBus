import 'package:flutter/foundation.dart';
import 'package:next_bus_admin/core/api/api_config.dart';
import 'package:next_bus_admin/core/storage/shared_preferences_helper.dart';

import 'add_bus_model.dart';
import 'bus_request_model.dart';
import 'bus_response_model.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

abstract class BusRemoteDataSource {
  Future<PaginatedBusResponse> getBuses(BusListRequestModel request);
  Future<BusModel> getBusById(String id);
  Future<BusModel> addBus(AddBusModel request);
}

class BusRemoteDataSourceImpl implements BusRemoteDataSource {
  final http.Client client;
  final String baseUrl;

  BusRemoteDataSourceImpl({required this.client, required this.baseUrl});

  @override
  Future<PaginatedBusResponse> getBuses(BusListRequestModel request) async {
    try {
      PreferencesManager preferencesManager =
          await PreferencesManager.getInstance();
      final token = preferencesManager.jwtToken;
    final uri = Uri.parse(
      '${ApiConfig.nextBusUrl}/buses',
    ).replace(queryParameters: request.toQueryParameters());
    final response = await client.get(
      uri,
        headers: {'Authorization': 'Bearer $token'},
      );
      debugPrint(response.body);

    if (response.statusCode == 200) {
      return PaginatedBusResponse.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to load buses');
      }
    } catch (e) {
      throw Exception('Failed to load buses: $e');
    }
  }

  @override
  Future<BusModel> getBusById(String id) async {
    try {
      PreferencesManager preferencesManager =
          await PreferencesManager.getInstance();
      final token = preferencesManager.jwtToken;
    final uri = Uri.parse(
      '${ApiConfig.nextBusUrl}/buses/$id',
    );
    final response = await client.get(
      uri,
        headers: {'Authorization': 'Bearer $token'},
      );
      debugPrint(response.body);

    if (response.statusCode == 200) {
      return BusModel.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to load buses');
      }
    } catch (e) {
      throw Exception('Failed to load buses: $e');
    }
  }

  @override
  Future<BusModel> addBus(AddBusModel request) async {
    try {
      PreferencesManager preferencesManager =
          await PreferencesManager.getInstance();
      final token = preferencesManager.jwtToken;
      final uri = Uri.parse(
        '${ApiConfig.nextBusUrl}/buses',
      );
      
      // Convert request to proper JSON string
      final jsonBody = json.encode(request.toJson());
      debugPrint('Request body: $jsonBody');
      
      final response = await client.post(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonBody,
      );
      
      debugPrint('Response status code: ${response.statusCode}');
      debugPrint('Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        return BusModel.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to add bus: ${response.body}');
      }
    } catch (e) {
      throw Exception('Failed to add bus: $e');
    }
  }
}
