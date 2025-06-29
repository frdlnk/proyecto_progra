/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.productsProject.main.services;

import com.productsProject.main.models.Product;
import java.util.List;

/**
 *
 * @author lab.informatica
 */
public interface ProductService {
    List<Product> getProducts();
    Product getProduct(int id);
    Product postProduct(Product product);
    Product putProduct(Product product);
    boolean deleteProduct(int id);
    Product patchProduct(Product product);
}
