import 'package:flutter/foundation.dart';
import 'package:next_bus_admin/core/api/api_config.dart';
import 'package:next_bus_admin/core/storage/shared_preferences_helper.dart';

import 'models/add_bus_model.dart';
import 'models/bus_request_model.dart';
import 'models/bus_response_model.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

abstract class BusRemoteDataSource {
  Future<PaginatedBusResponse> getBuses(BusListRequestModel request);
  Future<BusModel> getBusById(String id);
  Future<BusModel> addBus(AddBusModel request);
  Future<BusModel> approveBus(String id);
  Future<BusModel> editBus(String id, AddBusModel request);
  Future<AddBusModel> getEditRequest(String id);
  Future<BusModel> approveEditRequest(String id);
  Future<BusModel> rejectApproval(String id);
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
      final uri = Uri.parse('${ApiConfig.nextBusUrl}/buses/$id');
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
      final uri = Uri.parse('${ApiConfig.nextBusUrl}/buses');

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

  @override
  Future<BusModel> approveBus(String id) async {
    try {
      PreferencesManager preferencesManager =
          await PreferencesManager.getInstance();
      final token = preferencesManager.jwtToken;
      final uri = Uri.parse('${ApiConfig.nextBusUrl}/buses/$id/approve');
      final response = await client.post(
        uri,
        headers: {'Authorization': 'Bearer $token'},
      );
      debugPrint(response.body);
      final responseBody = json.decode(response.body);
      final message = responseBody['message'];

      if (response.statusCode == 200) {
        return BusModel.fromJson(responseBody);
      } else {
        throw Exception(message);
      }
    } catch (e) {
      throw Exception('Failed to approve bus: $e');
    }
  }

  @override
  Future<BusModel> editBus(String id, AddBusModel request) async {
    try {
      PreferencesManager preferencesManager =
          await PreferencesManager.getInstance();
      final token = preferencesManager.jwtToken;
      final uri = Uri.parse('${ApiConfig.nextBusUrl}/buses/$id/edit');

      // Convert request to proper JSON string
      final jsonBody = json.encode(request.toJson());
      debugPrint('Edit Bus Request body: $jsonBody');

      final response = await client.post(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonBody,
      );

      debugPrint('Edit Bus Response status code: ${response.statusCode}');
      debugPrint('Edit Bus Response body: ${response.body}');

      final responseBody = json.decode(response.body);
      final message = responseBody['message'];

      if (response.statusCode == 200) {
        return BusModel.fromJson(responseBody);
      } else {
        throw Exception(message);
      }
    } catch (e) {
      throw Exception('Failed to edit bus: $e');
    }
  }

  @override
  Future<AddBusModel> getEditRequest(String id) async {
    try {
      PreferencesManager preferencesManager =
          await PreferencesManager.getInstance();
      final token = preferencesManager.jwtToken;
      final uri = Uri.parse('${ApiConfig.nextBusUrl}/buses/$id/edit-request');

      final response = await client.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      debugPrint(
        'Get Edit Request Response status code: ${response.statusCode}',
      );
      debugPrint('Get Edit Request Response body: ${response.body}');

      if (response.statusCode == 200) {
        return AddBusModel.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to get edit request: ${response.body}');
      }
    } catch (e) {
      throw Exception('Failed to get edit request: $e');
    }
  }

  @override
  Future<BusModel> approveEditRequest(String id) async {
    try {
      PreferencesManager preferencesManager =
          await PreferencesManager.getInstance();
      final token = preferencesManager.jwtToken;
      final uri = Uri.parse('${ApiConfig.nextBusUrl}/buses/$id/approve-edit');
      final response = await client.post(
        uri,
        headers: {'Authorization': 'Bearer $token'},
      );
      debugPrint(response.body);
      final responseBody = json.decode(response.body);
      final message = responseBody['message'];

      if (response.statusCode == 200) {
        return BusModel.fromJson(responseBody);
      } else {
        throw Exception(message);
      }
    } catch (e) {
      throw Exception('Failed to approve edit request: $e');
    }
  }

  @override
  Future<BusModel> rejectApproval(String id) async {
    try {
      PreferencesManager preferencesManager =
          await PreferencesManager.getInstance();
      final token = preferencesManager.jwtToken;
      final uri = Uri.parse('${ApiConfig.nextBusUrl}/buses/$id/reject');
      final response = await client.post(
        uri,
        headers: {'Authorization': 'Bearer $token'},
      );
      debugPrint(response.body);
      final responseBody = json.decode(response.body);
      final message = responseBody['message'];

      if (response.statusCode == 200) {
        return BusModel.fromJson(responseBody);
      } else {
        throw Exception(message);
      }
    } catch (e) {
      throw Exception('Failed to reject edit request: $e');
    }
  }
}
