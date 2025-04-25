import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import '../../../../core/api/api_config.dart';
import 'login_model.dart';

abstract class AuthRemoteDataSource {
  Future<LoginResponseModel> login(LoginRequestModel request);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final http.Client client;

  AuthRemoteDataSourceImpl(this.client);

  @override
  Future<LoginResponseModel> login(LoginRequestModel request) async {
    debugPrint("${ApiConfig.nextBusUrl}/auth/login");
    final response = await client.post(
      Uri.parse("${ApiConfig.nextBusUrl}/auth/login"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(request.toJson()),
    );
    debugPrint(response.body);

    if (response.statusCode == 200) {
      final jsonData = jsonDecode(response.body);
      return LoginResponseModel.fromJson(jsonData);
    } else {
      throw response.body;
    }
  }
}